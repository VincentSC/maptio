import { DataService } from "./../../shared/services/data.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs/Rx";
import { Initiative } from "./../../shared/model/initiative.data";
import { DataSet } from "./../../shared/model/dataset.data";
import { Team } from "./../../shared/model/team.data";
import { UserFactory } from "./../../shared/services/user.factory";
import { TeamFactory } from "./../../shared/services/team.factory";
import { EmitterService } from "./../../shared/services/emitter.service";
import { DatasetFactory } from "./../../shared/services/dataset.factory";
import { ViewChild } from "@angular/core";
import { BuildingComponent } from "./../building/building.component";
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { User } from "../../shared/model/user.data";
import { Auth } from "../../shared/services/auth/auth.service";
import * as _ from "lodash";
import { UserService } from "../../shared/services/user/user.service";

@Component({
    selector: "workspace",
    templateUrl: "workspace.component.html",
    styleUrls: ["./workspace.component.css"]
})


export class WorkspaceComponent implements OnInit, OnDestroy {

    @ViewChild("building")
    buildingComponent: BuildingComponent

    public isBuildingPanelCollapsed: boolean = true;
    public isDetailsPanelCollapsed: boolean = true;
    private datasetId: string;
    private emitterSubscription: Subscription;
    private routeSubscription: Subscription;
    private userSubscription: Subscription;

    public dataset$: Promise<DataSet>;
    public members: Promise<Array<User>>;
    public team$: Promise<Team>;
    public teams$: Promise<Team[]>;

    public openedNode: Initiative;
    public openedNodeParent: Initiative;
    public openedNodeTeamId: string;

    public mapped: Initiative;

    @ViewChild("dragConfirmation")
    dragConfirmationModal: NgbModal;

    constructor(private auth: Auth, private route: ActivatedRoute, private datasetFactory: DatasetFactory, private dataService: DataService,
        private teamFactory: TeamFactory, private userFactory: UserFactory, private userService: UserService, private modalService: NgbModal) {
    }

    ngOnDestroy(): void {
        EmitterService.get("currentDataset").emit(undefined)
        if (this.routeSubscription) this.routeSubscription.unsubscribe();
        if (this.userSubscription) this.userSubscription.unsubscribe();
    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe((params: Params) => {
            this.datasetId = params["mapid"];

            this.dataset$ = this.datasetFactory.get(this.datasetId).then((d: DataSet) => {
                EmitterService.get("currentDataset").emit(d)
                return d;
            });

            this.dataset$.then(d => {

            })

            this.team$ = this.dataset$.then((dataset: DataSet) => {
                return this.teamFactory.get(dataset.initiative.team_id).then(t => t, () => { return Promise.reject("No team") }).catch(() => { })
            });

            this.members = this.team$.then((team: Team) => {
                if (team)
                    return this.userFactory.getUsers(team.members.map(m => m.user_id))
                        .then(members => _.compact(members))
                        .then(members => _.sortBy(members, m => m.name))
            });

            this.buildingComponent.loadData(this.datasetId, params["nodeid"]) // .then(()=>{console.log("finished buioding data")});
        });

        this.userSubscription = this.auth.getUser().subscribe((user: User) => {
            this.teams$ = Promise.all(
                user.teams.map(
                    (team_id: string) => this.teamFactory.get(team_id).then((team: Team) => { return team }, () => { return Promise.reject("No team") }).catch(() => { return undefined })
                )
            ).then((teams: Team[]) => {
                return teams.filter(t => { return t !== undefined })
            })

        })

    }

    saveDetailChanges() {
        // console.log("saveDetailChanges")
        this.buildingComponent.saveChanges();
    }

    saveChanges(initiative: Initiative) {
        // console.log("initiative", initiative);

        this.datasetFactory.upsert(new DataSet({ _id: this.datasetId, initiative: initiative }), this.datasetId)
            .then((hasSaved: boolean) => {
                console.log("seding change to mapping")
                this.dataService.set({ initiative: initiative, datasetId: this.datasetId });
                return hasSaved;
            }, (reason) => { console.log(reason) });
        // .then(() => {
        //     this.dataset$ = this.datasetFactory.get(this.datasetId)
        // });

    }

    addTeamToInitiative(team: Team) {
        this.modalService.open(this.dragConfirmationModal).result.then((result: boolean) => {
            if (result) {
                this.isBuildingPanelCollapsed = true;
                this.isDetailsPanelCollapsed = true;
                this.team$ = this.dataset$.then((dataset: DataSet) => {
                    dataset.initiative.team_id = team.team_id;
                    this.datasetFactory.upsert(dataset, dataset._id).then(() => {
                        this.buildingComponent.loadData(dataset._id);
                    })
                    return team;
                });
                this.updateTeamMembers();
            }
        })
            .catch(reason => { });



    }

    updateTeamMembers() {
        this.isBuildingPanelCollapsed = true;
        this.isDetailsPanelCollapsed = true;
        this.members = this.team$
            .then((team: Team) => {
                if (team)
                    return team.members;
            });
    }

    toggleBuildingPanel() {
        this.isBuildingPanelCollapsed = !this.isBuildingPanelCollapsed;
    }

    toggleDetailsPanel() {
        this.isDetailsPanelCollapsed = !this.isDetailsPanelCollapsed;
    }


    openDetails(node: Initiative, willCloseBuildingPanel: boolean = false) {
        // console.log(node)
        Promise.all([this.dataset$, this.team$])
            .then((result: [DataSet, Team]) => {
                let dataset = result[0]
                let team = result[1];
                this.openedNodeParent = node.getParent(dataset.initiative);
                this.openedNode = node;
            })
            .then(() => {
                this.isBuildingPanelCollapsed = willCloseBuildingPanel;
                this.isDetailsPanelCollapsed = false;
            })
    }

    addInitiative(node: Initiative) {
        console.log("workspace.compoentn", "adding to", node.name);
        this.buildingComponent.addNodeTo(node);
    }

    removeInitiative(node: Initiative) {
        console.log("workspace.compoentn", "remove", node.name);
        this.buildingComponent.removeNode(node);
    }

}