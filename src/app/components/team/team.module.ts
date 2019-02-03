import { TeamIntegrationsComponent } from "./single/integrations/integrations.component";
import { Permissions } from "../../shared/model/permission.data";
import { PermissionGuard } from "../../shared/services/guards/permission.guard";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { KeysPipe } from "../../pipes/keys.pipe";
import { AccessGuard } from "../../shared/services/guards/access.guard";
import { AuthGuard } from "../../shared/services/guards/auth.guard";
import { SharedModule } from "../../shared/shared.module";
import { TeamListComponent } from "./list/team-list.component";
import { TeamListComponentResolver } from "./list/team-list.resolver";
import { TeamImportComponent } from "./single/import/import.component";
import { TeamMapsComponent } from "./single/maps/maps.component";
import { TeamMembersComponent } from "./single/members/members.component";
import { TeamSettingsComponent } from "./single/settings/settings.component";
import { TeamComponent } from "./single/team.component";
import { TeamComponentResolver } from "./single/team.resolver";
import { TeamBillingComponent } from "./single/billing/billing.component";
import { CommonComponentsModule } from "../../shared/common-components.module";
import { MemberSingleComponent } from "./single/members/member-single.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PermissionsModule } from "../../shared/permissions.module";
import { CardTeamComponent } from "../../shared/components/card-team/card-team.component";
import { CreateTeamComponent } from "../../shared/components/create-team/create-team.component";
import { CreateMapModule } from "../../shared/create-map.module";

const routes: Routes = [
    {
        path: "",
        children: [
            {
                path: "", component: TeamListComponent, canActivate: [AuthGuard],
                resolve: {
                    teams: TeamListComponentResolver
                }
            },
            {
                path: ":teamid/:slug",
                resolve: {
                    assets: TeamComponentResolver
                },
                component: TeamComponent,
                data: { breadcrumbs: "{{assets.team.name}}" },
                canActivate: [AuthGuard, AccessGuard],
                children: [
                    { path: "", redirectTo: "members", pathMatch: "full" },
                    { path: "members", component: TeamMembersComponent, data: { breadcrumbs: true, text: "Members" } },
                    {
                        path: "import",
                        component: TeamImportComponent,
                        canActivate: [PermissionGuard],
                        data: {
                            permissions: [Permissions.canInviteUser], breadcrumbs: true, text: "Import"
                        }
                    },
                    { path: "maps", component: TeamMapsComponent, data: { breadcrumbs: true, text: "Maps" } },
                    { path: "integrations", component: TeamIntegrationsComponent, data: { breadcrumbs: true, text: "Integrations" } },
                    { path: "settings", component: TeamSettingsComponent, data: { breadcrumbs: true, text: "Name & Terminology" } },
                    { path: "billing", component: TeamBillingComponent, data: { breadcrumbs: true, text: "Billing" } }
                ]
            }
        ]

    }
];

@NgModule({
    imports: [
        CommonModule,
        // FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: "danger",
            cancelButtonType: "secondary"
        }),
        SharedModule,
        CommonComponentsModule,
        NgbTooltipModule,
        PermissionsModule,
        CreateMapModule
    ],
    declarations: [
        CardTeamComponent,
        CreateTeamComponent,
        TeamComponent,
        TeamListComponent,
        TeamMembersComponent,
        MemberSingleComponent,
        TeamSettingsComponent,
        TeamImportComponent,
        TeamIntegrationsComponent,
        TeamBillingComponent,
        TeamMapsComponent,
        KeysPipe
        
    ],
    providers: [TeamComponentResolver, TeamListComponentResolver]
})
export class TeamModule { }