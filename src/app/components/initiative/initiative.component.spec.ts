import { MarkdownModule } from "angular2-markdown";
import { AuthHttp } from "angular2-jwt";
import { UserFactory } from "./../../shared/services/user.factory";
import { RouterTestingModule } from "@angular/router/testing";
import { Team } from "./../../shared/model/team.data";
import { ErrorService } from "./../../shared/services/error/error.service";
import { MockBackend } from "@angular/http/testing";
import { Http, BaseRequestOptions } from "@angular/http";
import { TeamFactory } from "./../../shared/services/team.factory";
import { User } from "./../../shared/model/user.data";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { DebugElement } from "@angular/core"
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { InitiativeComponent } from "./initiative.component";
import { Initiative } from "../../shared/model/initiative.data";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { authHttpServiceFactoryTesting } from "../../../test/specs/shared/authhttp.helper.shared";
import { Auth } from "../../shared/services/auth/auth.service";
import { DatasetFactory } from "../../shared/services/dataset.factory";
import { Helper } from "../../shared/model/helper.data";
import { Role } from "../../shared/model/role.data";

describe("initiative.component.ts", () => {

    let component: InitiativeComponent;
    let target: ComponentFixture<InitiativeComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let inputNode: Initiative;
    let inputTeam: Team;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [Ng2Bs3ModalModule, NgbModule.forRoot(), FormsModule, RouterTestingModule, MarkdownModule.forRoot()],
            declarations: [InitiativeComponent],
            providers: [TeamFactory, UserFactory, DatasetFactory,
                {
                    provide: Http,
                    useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
                        return new Http(mockBackend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                MockBackend,
                BaseRequestOptions,
                ErrorService,
                {
                    provide: AuthHttp,
                    useFactory: authHttpServiceFactoryTesting,
                    deps: [Http, BaseRequestOptions]
                },
                { provide: Auth, useValue: undefined }
            ]
        })
            .compileComponents()

    }));

    beforeEach(() => {
        target = TestBed.createComponent(InitiativeComponent);
        component = target.componentInstance;
        // de = target.debugElement.query(By.css("modal"));
        // el = de.nativeElement;


        inputNode = {
            id: 1, name: "ORIGINAL", description: "ORIGINAL", children: [], helpers: [], start: new Date(2010, 1, 1), accountable: <User>{ name: "ORIGINAL" },
            hasFocus: false, isZoomedOn: false, team_id: "team_id", isSearchedFor: false, search: undefined, traverse: undefined, deserialize: undefined, tryDeserialize: undefined,
            getSlug: undefined, getParent: undefined, isDraggable: false, traversePromise: undefined, isExpanded: true, getRoles: undefined
        };

        component.node = inputNode;

        target.detectChanges(); // trigger initial data binding
    });

    describe("Controller", () => {
        describe("saveRole", () => {
            it("should save role", () => {
                let helper = new Helper({ name: "John Doe" })
                component.saveRole(helper, "some role");
                expect(helper.roles[0].description).toBe("some role")
            });

            it("should update role", () => {
                let helper = new Helper({ name: "John Doe", roles: [new Role({ description: "some role" })] })
                component.saveRole(helper, "some role update");
                expect(helper.roles[0].description).toBe("some role update")
            });
        });

        describe("saveHelper", () => {
            it("should save new helper when not present", () => {
                spyOn(component, "onBlur")
                component.node.helpers = []
                component.saveHelper({ item: new User({ name: "John Doe" }), preventDefault: null });
                expect(component.node.helpers.length).toBe(1);
                expect(component.node.helpers[0].name).toBe("John Doe");
                expect(component.node.helpers[0].roles).toEqual([]);
                expect(component.onBlur).toHaveBeenCalled();
            });

            it("should not save new helper when present", () => {
                spyOn(component, "onBlur")
                component.node.helpers = [new Helper({ name: "John Doe" })]
                component.saveHelper({ item: new User({ name: "John Doe" }), preventDefault: null });
                expect(component.node.helpers.length).toBe(1);
                expect(component.node.helpers[0].name).toBe("John Doe");
                expect(component.node.helpers[0].roles).toEqual([]);
                expect(component.onBlur).toHaveBeenCalled();
            });
        });

        describe("removeHelper", () => {
            it("should remove helper from list", () => {
                spyOn(component, "onBlur")
                component.node.helpers = [new Helper({ name: "John Doe", user_id: "1" }), new Helper({ name: "Jane Doe", user_id: "2" })]
                component.removeHelper(new Helper({ name: "John Doe", user_id: "1" }));
                expect(component.node.helpers.length).toBe(1);
                expect(component.node.helpers[0].name).toBe("Jane Doe");
                expect(component.node.helpers[0].roles).toEqual([]);
                expect(component.onBlur).toHaveBeenCalled();
            });
        });

        describe("saveName", () => {
            it("should save a new name", () => {
                expect(component.node.name).toBe("ORIGINAL");
                component.saveName("CHANGED");
                expect(component.node.name).toBe("CHANGED");
            });
        });

        describe("saveDescription", () => {
            it("should save a new description", () => {
                expect(component.node.description).toBe("ORIGINAL");
                component.saveDescription("CHANGED");
                expect(component.node.description).toBe("CHANGED");
            });
        });

        describe("saveAccountable", () => {
            it("should save accountable person when valid person is given", () => {
                expect(component.node.accountable).toBeDefined();
                expect(component.node.accountable.name).toBe("ORIGINAL");
                component.saveAccountable({ item: new User({ name: "John Doe" }), preventDefault: null });
                expect(component.node.accountable.name).toBe("John Doe");
            });
        });

        describe("removeAuthority", () => {
            it("should save accountable person when valid person is given", () => {
                component.node.accountable = new User({ name: "John" })
                component.removeAuthority();
                expect(component.node.accountable).toBeUndefined();
            });
        });

    });

    describe("View", () => {

        it("should call saveName when changed name is changed", () => {
            let spySaveName = spyOn(component, "saveName");
            let element = target.debugElement.query(By.css("#inputName"));
            (element.nativeElement as HTMLInputElement).value = "CHANGED";
            (element.nativeElement as HTMLInputElement).dispatchEvent(new Event("input"))
            expect(spySaveName).toHaveBeenCalledWith("CHANGED");
        });

        it("should call saveDescription when description is changed", () => {
            let spySaveDescription = spyOn(component, "saveDescription");
            let element = target.debugElement.query(By.css("#inputDescription"));
            (element.nativeElement as HTMLTextAreaElement).value = "CHANGED";
            (element.nativeElement as HTMLElement).dispatchEvent(new Event("input"))

            expect((element.nativeElement as HTMLElement).dataset["provide"]).toBe("markdown-editable");
            expect(spySaveDescription).toHaveBeenCalledWith("CHANGED");
        });

        it("saves the accountable person", () => {
            let spySaveAccountable = spyOn(component, "saveAccountable");
            let element = target.debugElement.query(By.css("#inputAccountable"));
            (element.nativeElement as HTMLInputElement).value = JSON.stringify({ item: new User({ name: "John Doe" }) });
            (element.nativeElement as HTMLInputElement).dispatchEvent(new CustomEvent("selectItem"));
            // FIXME : Check the saveAccountable arguments but how ?
            expect(spySaveAccountable).toHaveBeenCalled();
        });

    });



});
