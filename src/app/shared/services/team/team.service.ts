import { Injectable } from "@angular/core";
import { TeamFactory } from "../team.factory";
import { UserFactory } from "../user.factory";
import { User } from "../../model/user.data";
import { Team } from "../../model/team.data";
import { Angulartics2Mixpanel } from "../../../../../node_modules/angulartics2";
import { IntercomService } from "./intercom.service";

@Injectable()
export class TeamService {

    constructor(private teamFactory: TeamFactory, private userFactory: UserFactory,
        private analytics: Angulartics2Mixpanel, private intercomService: IntercomService) {

    }

    create(name: string, user: User, members?: User[], isTemporary?: boolean, isExample?: boolean) {
        return this.teamFactory.create(new Team({
            name: name,
            members: members,
            isTemporary: isTemporary,
            isExample: isExample,
            freeTrialLength: 14,
            isPaying: false
        }))
            .then((team: Team) => {
                user.teams.push(team.team_id);
                return this.userFactory.upsert(user)
                    .then((result: boolean) => {
                        if (result) {
                            if (!isTemporary && !isExample) {
                                this.analytics.eventTrack("Create team", { email: user.email, name: name, teamId: team.team_id })

                            }
                        }
                        else {
                            throw `Unable to add you to organization ${name}!`
                        }
                    },
                        () => { throw `Unable to create organization ${name}!` })
                    .then(() => {
                        return team
                    })
            },
                () => { throw `Unable to create organization ${name}!` })
            .then((team: Team) => {
                if (!isExample) {
                    return this.intercomService.createTeam(user, team).toPromise().then(result => {
                        if (result)
                            return team
                        else
                            throw "Cannot sync organization with Intercom."
                    })
                }
                else {
                    return team;
                }
            })
    }

    createTemporary(user: User) {
        return this.create("", user, [], true, false);
    }

    createDemoTeam(user: User) {
        return this.userFactory.getUsers([
            "auth0|5c091c1e14668e36dcc5fee5",
            "auth0|5c091a8b4d578823ecbfde5d",
            "auth0|5c09198dfb5415347c72b78c",
            "auth0|5c0916cc0b53141eaedcaf99",
            "google-oauth2|114631860882417255120"
        ])
            .then(members => {
                return this.create("The Banana app company", user, members, false, true)
            })
    }

    renameTemporary(team: Team, name: string) {
        if (!name) return Promise.reject("Organization name cannot be empty");
        team.name = name;
        team.isTemporary = false;
        return this.teamFactory.upsert(team)
    }


    saveTerminology(team: Team, name: string, authority: string, helper: string) {
        team.name = name;
        team.settings = { authority: authority, helper: helper }

        return this.teamFactory.upsert(team)
            .then((isUpdated: boolean) => {
                if (isUpdated) {
                    this.intercomService.sendEvent("Change terminology", { team: team.name, teamId: team.team_id, authority: team.settings.authority, helper: team.settings.helper });
                    return team;
                }
                else {
                    throw "Error while updating the organization"
                }
            })

    }
}