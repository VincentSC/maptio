import { PermissionGuard } from "./shared/services/guards/permission.guard";
import { PermissionService } from "./shared/model/permission.data";
import { CommonModule, Location, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from "@angular/common";
import { ErrorHandler, Injectable, InjectionToken, Injector, NgModule, Inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Http, HttpModule, RequestOptions } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { CloudinaryModule } from "@cloudinary/angular-5.x";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { AuthHttp } from "angular2-jwt";
import { Angulartics2Mixpanel, Angulartics2Module } from "angulartics2";
import { Cloudinary } from "cloudinary-core";
import { FileUploadModule } from "ng2-file-upload";
import { BreadcrumbsModule, BreadcrumbsConfig, Breadcrumb } from "@exalif/ngx-breadcrumbs";
import { FullstoryModule } from 'ngx-fullstory';

import { DeviceDetectorModule } from 'ngx-device-detector';
import { AnAnchorableComponent } from "../test/specs/shared/component.helper.shared";
import { environment } from "../environment/environment";
import { AccountComponent } from "./components/account/account.component";
import { AppComponent } from "./components/app.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { HelpComponent } from "./components/help/help.component";
import { HomeComponent } from "./components/home/home.component";
import { LoaderComponent } from "./components/loading/loader.component";
import { ChangePasswordComponent } from "./components/login/change-password.component";
import { LoginComponent } from "./components/login/login.component";
import { LogoutComponent } from "./components/login/logout.component";
import { SignupComponent } from "./components/login/signup.component";
import { TeamModule } from "./components/team/team.module";
import { NotFoundComponent } from "./components/unauthorized/not-found.component";
import { UnauthorizedComponent } from "./components/unauthorized/unauthorized.component";
import { WorkspaceModule } from "./components/workspace/workspace.module";
import { AuthConfiguration } from "./shared/services/auth/auth.config";
import { authHttpServiceFactory } from "./shared/services/auth/auth.module";
import { Auth } from "./shared/services/auth/auth.service";
import { HttpFactoryModule } from "./shared/services/auth/httpInterceptor";
import { DataService, CounterService } from "./shared/services/data.service";
import { DatasetFactory } from "./shared/services/dataset.factory";
import { JwtEncoder } from "./shared/services/encoding/jwt.service";
import { ErrorService } from "./shared/services/error/error.service";
import { ExportService } from "./shared/services/export/export.service";
import { FileService } from "./shared/services/file/file.service";
import { AccessGuard } from "./shared/services/guards/access.guard";
import { AuthGuard } from "./shared/services/guards/auth.guard";
import { WorkspaceGuard } from "./shared/services/guards/workspace.guard";
import { LoaderService } from "./shared/services/loading/loader.service";
import { MailingService } from "./shared/services/mailing/mailing.service";
import { TeamFactory } from "./shared/services/team.factory";
import { ColorService } from "./shared/services/ui/color.service";
import { UIService } from "./shared/services/ui/ui.service";
import { URIService } from "./shared/services/uri.service";
import { UserFactory } from "./shared/services/user.factory";
import { UserService } from "./shared/services/user/user.service";
import { IntercomModule } from 'ng-intercom';

import * as LogRocket from "logrocket";
import { BillingService } from "./shared/services/billing/billing.service";
import { BillingGuard } from "./shared/services/guards/billing.guard";

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { CreateMapComponent } from "./shared/components/create-map/create-map.component";
import { SharedModule } from "./shared/shared.module";
import { CommonComponentsModule } from "./shared/common-components.module";
import { PricingComponent } from "./components/pricing/pricing.component";
import { AuthorizeComponent } from "./components/login/authorize.component";
import { TermsComponent } from "./components/pricing/terms.component";
import { PrivacyComponent } from "./components/pricing/privacy.component";
import { CheckoutComponent } from "./components/pricing/checkout.component";
import { TeamService } from "./shared/services/team/team.service";
import { MapService } from "./shared/services/map/map.service";
import { InstructionsService } from "./shared/components/instructions/instructions.service";
import { OnboardingService } from "./shared/components/onboarding/onboarding.service";
import { SafePipe } from "./pipes/safe.pipe";
import { NgbModalModule, NgbTypeaheadModule, NgbTooltipModule, NgbPopoverModule } from "../../node_modules/@ng-bootstrap/ng-bootstrap";


const appRoutes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },

    { path: "home", component: HomeComponent },

    { path: "login", component: LoginComponent },
    { path: "authorize", component: AuthorizeComponent },

    { path: "logout", component: LogoutComponent },
    { path: "help", component: HelpComponent, data: { breadcrumbs: true, text: "Help" } },
    { path: "pricing", component: PricingComponent, data: { breadcrumbs: true, text: "Pricing" } },
    { path: "checkout", canActivate: [AuthGuard], component: CheckoutComponent },

    { path: "terms", component: TermsComponent, data: { breadcrumbs: true, text: "Terms of service" } },

    { path: "privacy", component: PrivacyComponent, data: { breadcrumbs: true, text: "Privacy policy" } },

    { path: "signup", component: SignupComponent },

    {
        path: ":shortid/:slug",
        component: AccountComponent,
        canActivate: [AuthGuard],
        data: { breadcrumbs: "Profile" }
    },
    { path: "unauthorized", component: UnauthorizedComponent },
    { path: "forgot", component: ChangePasswordComponent },
    { path: "404", component: NotFoundComponent },
    { path: "**", redirectTo: "/404" }
];

export const cloudinaryLib = {
    Cloudinary: Cloudinary
};


@NgModule({
    declarations: [
        AppComponent, AccountComponent, HeaderComponent, FooterComponent, LoginComponent, LogoutComponent, HomeComponent, UnauthorizedComponent, NotFoundComponent,
        ChangePasswordComponent, LoaderComponent, SignupComponent, AuthorizeComponent,
        HelpComponent, PricingComponent, TermsComponent, PrivacyComponent,
        DashboardComponent, CheckoutComponent,
        // for tests
        AnAnchorableComponent,
        SafePipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HttpModule,
        DeviceDetectorModule.forRoot(),
        BreadcrumbsModule.forRoot(),
        
        RouterModule.forRoot(appRoutes, { enableTracing: false }),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: "danger",
            cancelButtonType: "link"
        }),
        FullstoryModule.forRoot({
            fsOrg: environment.FULLSTORY_APP_ID,
            fsNameSpace: 'FS',
            fsDebug: false,
            fsHost: 'fullstory.com'
        }),
        Angulartics2Module.forRoot([Angulartics2Mixpanel]),
        FileUploadModule,
        NgProgressModule.forRoot(),
        NgProgressRouterModule,
        HttpFactoryModule,
        BrowserAnimationsModule,
        CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: environment.CLOUDINARY_CLOUDNAME, upload_preset: environment.CLOUDINARY_UPLOAD_PRESET }),
        TeamModule,
        WorkspaceModule,
        IntercomModule.forRoot({
            appId: environment.INTERCOM_APP_ID, // from your Intercom config
            updateOnRouterChange: true // will automatically run `update` on router event changes. Default: `false`
        }),

        SharedModule,
        CommonComponentsModule,
        NgbModalModule.forRoot(),
        NgbTypeaheadModule.forRoot(),
        NgbTooltipModule.forRoot(),
        NgbPopoverModule.forRoot()

    ],
    exports: [RouterModule],
    providers: [
        BrowserAnimationsModule,
        AuthGuard, AccessGuard, WorkspaceGuard, PermissionGuard, BillingGuard,
        AuthConfiguration,
        DataService, CounterService, URIService, ColorService, UIService, DatasetFactory, TeamFactory,
        ErrorService, Auth, UserService, TeamService, MapService, UserFactory, MailingService, JwtEncoder, LoaderService,
        ExportService, FileService, PermissionService, BillingService, InstructionsService, OnboardingService,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        }
    ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(breadcrumbsConfig: BreadcrumbsConfig) {

        if (process.env.NODE_ENV === "production") {
            LogRocket.init(environment.LOGROCKET_APP_ID, {
                network: {
                    isEnabled: true,
                }

            });
        }

        breadcrumbsConfig.postProcess = (breadcrumbs): Breadcrumb[] => {

            // Ensure that the first breadcrumb always points to home
            let processedBreadcrumbs = breadcrumbs;

            if (breadcrumbs.length && breadcrumbs[0].text !== 'Home') {
                processedBreadcrumbs = [
                    {
                        text: 'Home',
                        path: ''
                    }
                ].concat(breadcrumbs);
            }

            return processedBreadcrumbs;
        };
    }
}
