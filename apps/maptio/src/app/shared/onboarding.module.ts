import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OnboardingComponent } from "./components/onboarding/onboarding.component";
import { SharedModule } from "./shared.module";
import { IntercomService } from "./services/team/intercom.service";
import { AddTerminologyComponent } from "./components/onboarding/add-terminology.component";
import { CommonModalComponent } from "./components/modal/modal.component";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { OnboardingService } from "./components/onboarding/onboarding.service";


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        SharedModule,
        NgbModalModule
    ],
    declarations: [
        OnboardingComponent,
        AddTerminologyComponent,
        CommonModalComponent
    ],
    providers: [
        IntercomService,
        OnboardingService,
    ],
    exports: [
        OnboardingComponent,
        AddTerminologyComponent,
        CommonModalComponent
    ]
})
export class OnboardingModule { }
