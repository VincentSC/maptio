import { Initiative } from "./../../shared/model/initiative.data";
import { DataSet } from "./../../shared/model/dataset.data";
import { TeamFactory } from "./../../shared/services/team.factory";
import { Router } from "@angular/router";
import { EmitterService } from "./../../shared/services/emitter.service";
import { UserFactory } from "./../../shared/services/user.factory";
import { HeaderComponent } from "./header.component";
import { ComponentFixture, TestBed, async, fakeAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DatasetFactory } from "../../shared/services/dataset.factory";
import { ErrorService } from "../../shared/services/error/error.service";
import { Auth } from "../../shared/services/auth/auth.service";
import { MockBackend } from "@angular/http/testing";
import { Http, BaseRequestOptions } from "@angular/http";
import { User } from "../../shared/model/user.data";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { Team } from "../../shared/model/team.data";
import { RouterTestingModule } from "@angular/router/testing";

export class AuthStub {
    fakeProfile: User = new User({
        name: "John Doe", email: "johndoe@domain.com",
        picture: "http://seemyface.com/user.jpg", user_id: "someId",
        datasets: ["dataset1", "dataset2"], teams: ["team1", "team2"]
    });

    public getUser(): Observable<User> {
        // console.log("here")
        return Observable.of(this.fakeProfile);
    }

    authenticated() {
        return;
    }

    login() {
        return;
    }

    logout() {
        return;
    }
}

describe("header.component.ts", () => {

    let component: HeaderComponent;
    let target: ComponentFixture<HeaderComponent>;
    // let DATASETS = [new DataSet({ name: "One", _id: "one" }), new DataSet({ name: "Two", _id: "two" }), new DataSet({ name: "Three", _id: "three" })];
    let TEAMS = [new Team({ name: "Team one", team_id: "1" }), new Team({ name: "Team two", team_id: "2" })]
    let spyDataSetService: jasmine.Spy;
    let spyAuthService: jasmine.Spy;
    // let mockAuth: Auth;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [RouterTestingModule]
        }).overrideComponent(HeaderComponent, {
            set: {
                providers: [
                    DatasetFactory, UserFactory, TeamFactory,
                    { provide: Auth, useClass: AuthStub },
                    {
                        provide: Http,
                        useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
                            return new Http(mockBackend, options);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    // { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } },
                    MockBackend,
                    BaseRequestOptions,
                    ErrorService]
            }
        }).compileComponents();
    }));

    beforeEach(() => {
        target = TestBed.createComponent(HeaderComponent);

        component = target.componentInstance;





    });

    describe("View", () => {
        describe("List of datasets", () => {
            // it("should retrieve a list of datasets when user is valid", async(() => {
            //     let mockAuth = target.debugElement.injector.get(Auth);

            //     let mockDataSetService = target.debugElement.injector.get(DatasetFactory);
            //     spyDataSetService = spyOn(mockDataSetService, "get").and.callFake(function (parameters: any) {
            //         if (parameters instanceof User) {
            //             return Promise.resolve(DATASETS);
            //         }
            //         if (typeof parameters === "string") {
            //             return Promise.resolve(new DataSet({ _id: parameters.toString(), name: "a dataset" }));
            //         }
            //     });

            //     spyAuthService = spyOn(mockAuth, "getUser").and.callThrough();
            //     spyOn(mockAuth, "authenticated").and.returnValue(true);

            //     target.detectChanges();
            //     target.whenStable().then(() => {
            //         expect(spyAuthService.calls.any()).toEqual(true);

            //         expect(spyDataSetService).toHaveBeenCalledWith("dataset1");
            //         expect(spyDataSetService).toHaveBeenCalledWith("dataset2")
            //         expect(spyDataSetService).toHaveBeenCalledTimes(2);
            //     });

            // }));

            xit("should not show a list of datasets when user is invalid", fakeAsync(() => {
                let mockAuth = target.debugElement.injector.get(Auth);
                spyAuthService = spyOn(mockAuth, "getUser").and.callThrough();
                component.ngOnInit();

                expect(spyAuthService.calls.any()).toEqual(true);
                spyAuthService.calls.mostRecent().returnValue.toPromise().then(() => {
                    expect(spyDataSetService).not.toHaveBeenCalled();
                })
            }));
        });


        describe("Authentication", () => {
            it("should display LogIn button when no user is authenticated", () => {
                let mockAuth = target.debugElement.injector.get(Auth);
                let spyAuthService = spyOn(mockAuth, "authenticated").and.returnValue(false);
                target.detectChanges();

                let imgElement = target.debugElement.queryAll(By.css("li#profileInformation"));
                expect(imgElement.length).toBe(0);

                let button = target.debugElement.queryAll(By.css("li#loginButton a"));
                expect(button.length).toBe(1);
                expect(button[0].nativeElement.textContent).toBe("Log In");
                expect(spyAuthService).toHaveBeenCalled();
            });

            it("should display LogOut button and profile information when a user is authenticated", () => {
                let mockAuth = target.debugElement.injector.get(Auth);
                let spyAuthService = spyOn(mockAuth, "authenticated").and.returnValue(true);

                target.detectChanges();

                let imgElement = target.debugElement.query(By.css("li#profileInformation a div img")).nativeElement as HTMLImageElement;
                expect(imgElement.src).toBe("http://seemyface.com/user.jpg");

                let button = target.debugElement.queryAll(By.css("a#logoutButton"));
                expect(button.length).toBe(1);
                expect(button[0].nativeElement.textContent.trim()).toBe("Log Out");
                expect(spyAuthService).toHaveBeenCalled();
            });

            // it("should call navigate to /login  when LogIn button is clicked", () => {
            //     let mockAuth = target.debugElement.injector.get(Auth);
            //     let spyAuthService = spyOn(mockAuth, "authenticated").and.returnValue(false);
            //     let spyLogIn = spyOn(mockAuth, "login");

            //     target.detectChanges();
            //     let button = target.debugElement.query(By.css("li#loginButton a")).nativeElement as HTMLAnchorElement;
            //     button.dispatchEvent(new Event("click"));
            //     target.detectChanges();

            //     expect(spyLogIn).toHaveBeenCalled();
            //     expect(spyAuthService).toHaveBeenCalled();
            // })

            it("should call authenticate.logout()  when LogOut button is clicked", () => {
                let mockAuth = target.debugElement.injector.get(Auth);
                let mockRouter = target.debugElement.injector.get(Router);
                let spyAuthService = spyOn(mockAuth, "authenticated").and.returnValue(true);
                let spyLogOut = spyOn(mockAuth, "logout");
                let spyNavigate = spyOn(mockRouter, "navigate")

                target.detectChanges();
                let button = target.debugElement.query(By.css("a#logoutButton")).nativeElement as HTMLAnchorElement;
                button.dispatchEvent(new Event("click"));
                target.detectChanges();

                expect(spyLogOut).toHaveBeenCalled();
                expect(spyNavigate).toHaveBeenCalledWith([""])
                expect(spyAuthService).toHaveBeenCalled();
            })
        });

    });

    describe("Controller", () => {

        describe("goTo", () => {
            it("opens correct dataset", () => {
                let mockRouter = target.debugElement.injector.get(Router);
                let spyNavigate = spyOn(mockRouter, "navigate")
                let dataset = new DataSet({ _id: "some_id" });
                component.goTo(dataset);
                expect(spyNavigate).toHaveBeenCalledWith(["map", "some_id", "initiatives"]);
                expect(component.selectedDataset).toBe(dataset)
            });
        });


        // describe("chooseTeam", () => {
        //     it("should retrieve all matching datasets for a given team -- maps exist", async(() => {
        //         let mockAuth: Auth = target.debugElement.injector.get(Auth);
        //         let spyAuth = spyOn(mockAuth, "getUser").and.callThrough();
        //         let mockDataSetService = target.debugElement.injector.get(DatasetFactory);
        //         spyDataSetService = spyOn(mockDataSetService, "get").and.callFake(function (datasetName: string) {
        //             if (datasetName === "dataset1") {
        //                 return Promise.resolve(new DataSet({ name: "dataset1", team_id: "1" }))
        //             } else {
        //                 return Promise.resolve(new DataSet({ name: datasetName, team_id: "xxxx" }))
        //             }
        //         })

        //         component.ngOnInit();
        //         component.chooseTeam(new Team({ name: "team1", team_id: "1" }));
        //         spyAuth.calls.mostRecent().returnValue.toPromise().then((user: User) => {
        //             //  console.log(user.datasets)
        //             expect(spyDataSetService).toHaveBeenCalledWith("dataset1");
        //             expect(spyDataSetService).toHaveBeenCalledWith("dataset2");
        //             component.datasets$.then(ds => expect(ds.length).toBe(1))
        //             component.areMapsAvailable.then(r => expect(r).toBe(true))
        //         });

        //     }));

        //     it("should retrieve all matching datasets for a given team -- maps do no exists", async(() => {
        //         let mockAuth: Auth = target.debugElement.injector.get(Auth);
        //         let spyAuth = spyOn(mockAuth, "getUser").and.callThrough();
        //         let mockDataSetService = target.debugElement.injector.get(DatasetFactory);
        //         spyDataSetService = spyOn(mockDataSetService, "get").and.callFake(function (datasetName: string) {

        //             return Promise.resolve(new DataSet({ name: datasetName, team_id: "xxxx" }))
        //         })

        //         component.ngOnInit();
        //         component.chooseTeam(new Team({ name: "team1", team_id: "1" }));
        //         spyAuth.calls.mostRecent().returnValue.toPromise().then((user: User) => {
        //             //  console.log(user.datasets)
        //             expect(spyDataSetService).toHaveBeenCalledWith("dataset1");
        //             expect(spyDataSetService).toHaveBeenCalledWith("dataset2");
        //             component.datasets$.then(ds => expect(ds.length).toBe(0))
        //             component.areMapsAvailable.then(r => expect(r).toBe(false))
        //         });

        //     }));
        // })

        describe("ngOnInit", () => {


            it("should retrieve user and matching teams", async(() => {
                let mockAuth: Auth = target.debugElement.injector.get(Auth);
                let spyAuth = spyOn(mockAuth, "getUser").and.callThrough();
                let mockTeamService = target.debugElement.injector.get(TeamFactory);
                let spyTeamService = spyOn(mockTeamService, "get").and.returnValue(Promise.resolve(new Team({ team_id: "something" })));

                component.ngOnInit();
                spyAuth.calls.mostRecent().returnValue.toPromise().then((user: User) => {
                    expect(spyTeamService).toHaveBeenCalledWith("team1");
                    expect(spyTeamService).toHaveBeenCalledWith("team2");
                });

            }));

            it("should call error service if authentication doesnt return user", async(() => {

                let errorMsg = "Authentication failed";
                let mockError: ErrorService = target.debugElement.injector.get(ErrorService);
                let mockAuth = target.debugElement.injector.get(Auth);

                let spyAuth = spyOn(mockAuth, "getUser").and.callFake(function () { return Observable.throw(errorMsg) })
                let spyError = spyOn(mockError, "handleError");

                component.ngOnInit();
                expect(spyAuth).toHaveBeenCalledTimes(1);
                expect(spyError).toHaveBeenCalledWith(errorMsg);
            }))


            // fit("should call error service if datasets retrieval doesnt work", async(() => {
            //     let errorMsg = "Cant find datasets for this user";
            //     let mockAuth: Auth = target.debugElement.injector.get(Auth);
            //     let mockError: ErrorService = target.debugElement.injector.get(ErrorService);
            //     let mockDatasetFactory: DatasetFactory = target.debugElement.injector.get(DatasetFactory);

            //     let spyAuth = spyOn(mockAuth, "getUser").and.callThrough();
            //     let spyDatasets = spyOn(mockDatasetFactory, "get").and.returnValue(Promise.reject<void>(errorMsg))
            //     let spyError = spyOn(mockError, "handleError");

            //     component.ngOnInit();
            //     spyDatasets.calls.mostRecent().returnValue.then(() => { }).catch(() => {
            //         expect(spyError).toHaveBeenCalledWith(errorMsg);
            //     })
            //     expect(spyAuth).toHaveBeenCalledTimes(1);
            //     expect(spyDatasets).toHaveBeenCalledTimes(1);
            // }));


        });


        describe("createDataset", () => {
            it("should create a dataset with no name and then attach it to the authenticated user and open it", async(() => {
                let mockFactory = target.debugElement.injector.get(DatasetFactory);
                let mockTeamFactory = target.debugElement.injector.get(TeamFactory);
                let mockRouter = target.debugElement.injector.get(Router);
                let spyGetTeams = spyOn(mockTeamFactory, "get").and.returnValue(Promise.resolve(TEAMS));
                let spyCreate = spyOn(mockFactory, "create").and.returnValue(Promise.resolve(new DataSet({ _id: "created_id" })));
                let spyAdd = spyOn(mockFactory, "add").and.returnValue(Promise.resolve(true));
                let spyOpen = spyOn(mockRouter, "navigate");

                component.createDataset("new initiative");
                spyCreate.calls.mostRecent().returnValue.then(() => {
                    expect(spyAdd).toHaveBeenCalled()
                    spyAdd.calls.mostRecent().returnValue.then(() => {
                        expect(spyOpen).toHaveBeenCalledWith(["map", "created_id"]);
                    });
                });
                expect(spyCreate).toHaveBeenCalledWith(jasmine.objectContaining({ initiative: jasmine.objectContaining({ name: "new initiative" }) }))
            }));

            it("should call errorService if creation doesnt work", async(() => {
                let mockFactory = target.debugElement.injector.get(DatasetFactory);
                let mockRouter = target.debugElement.injector.get(Router);

                let error = target.debugElement.injector.get(ErrorService);
                let spyError = spyOn(error, "handleError");
                let spyCreate = spyOn(mockFactory, "create").and.returnValue(Promise.reject("Didnt work"));
                let spyAdd = spyOn(mockFactory, "add")
                let spyOpen = spyOn(mockRouter, "navigate");

                component.createDataset("new initiative");
                spyCreate.calls.mostRecent().returnValue.then(() => {
                    expect(spyAdd).not.toHaveBeenCalled();
                }).catch(() => {
                    expect(spyError).toHaveBeenCalled();
                });
                expect(spyCreate).toHaveBeenCalled();
                expect(spyOpen).not.toHaveBeenCalled();
            }));

            it("should call errorService if adding dataset doesnt work", async(() => {
                let mockFactory = target.debugElement.injector.get(DatasetFactory);
                let mockRouter = target.debugElement.injector.get(Router);

                let error = target.debugElement.injector.get(ErrorService);
                let spyError = spyOn(error, "handleError");
                let spyCreate = spyOn(mockFactory, "create").and.returnValue(Promise.resolve(true));
                let spyAdd = spyOn(mockFactory, "add").and.returnValue(Promise.reject("Didnt work"));
                let spyOpen = spyOn(mockRouter, "navigate");

                component.createDataset("new initiative");
                spyCreate.calls.mostRecent().returnValue.then(() => {
                    expect(spyAdd).toHaveBeenCalled();
                    spyAdd.calls.mostRecent().returnValue.then(() => {

                    }).catch(() => { expect(spyError).toHaveBeenCalled(); });
                });
                expect(spyCreate).toHaveBeenCalled();
                expect(spyOpen).not.toHaveBeenCalled();
            }));
        });
    });











});
