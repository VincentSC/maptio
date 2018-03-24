import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Angulartics2Mixpanel } from "angulartics2";
import { User } from "../../shared/model/user.data";
import { UserService } from "../../shared/services/user/user.service";
import { repeatValidator } from "./../../shared/directives/equal-validator.directive";
import { UserRole } from "./../../shared/model/permission.data";
import { LoaderService } from "./../../shared/services/loading/loader.service";


@Component({
    selector: "signup",
    templateUrl: "./signup.component.html"
})

export class SignupComponent implements OnInit {

    public TOS_URL: string = "https://termsfeed.com/terms-conditions/f0e548940bde8842b1fb58637ae048c0"
    public PRIVACY_URL: string = "https://termsfeed.com/privacy-policy/61f888ebea93b0029582b88a7be1e1e3"


    public email: string;
    public confirmedEmail: string;
    public firstname: string;
    public lastname: string;
    // public isTermsAccepted: boolean;

    public isEmailAlreadyExist: boolean
    public isRedirectToActivate: boolean;
    public isConfirmationEmailSent: boolean;
    public signUpMessageFail: string;
    public isLoading: boolean;
    public userToken: string;
    public isResending: boolean;

    public signupForm: FormGroup;

    constructor(private userService: UserService, private loader: LoaderService,
        private analytics: Angulartics2Mixpanel, private cd: ChangeDetectorRef) {
        this.signupForm = new FormGroup({
            "firstname": new FormControl(this.firstname, [
                Validators.required,
                Validators.minLength(2)
            ]),
            "lastname": new FormControl(this.lastname, [
                Validators.required,
                Validators.minLength(2)
            ]),
            "email": new FormControl(this.email, [
                Validators.required
            ]),
            "confirmedEmail": new FormControl(this.confirmedEmail, [
                Validators.required, repeatValidator("email")
            ])
            // "isTermsAccepted": new FormControl(this.isTermsAccepted, [
            //     Validators.requiredTrue
            // ])
        });

    }

    ngOnInit() { }

    createAccount() {
        this.isConfirmationEmailSent = false;
        this.isRedirectToActivate = false;
        this.isEmailAlreadyExist = false;
        this.signUpMessageFail = "";

        if (this.signupForm.dirty && this.signupForm.valid) {
            this.isLoading = true;
            let email = this.signupForm.controls["email"].value
            let firstname = this.signupForm.controls["firstname"].value
            let lastname = this.signupForm.controls["lastname"].value

            Promise.all([this.isEmailExist(email), this.isActivationPending(email, firstname, lastname)])
                .then(([isEmailExist, { isActivationPending, userToken }]) => {
                    this.isLoading = true;
                    if (isEmailExist) {
                        if (isActivationPending) {
                            // account is created but still needs activation => display message to check email or resend invitation
                            this.userToken = userToken;
                            this.isRedirectToActivate = true;
                            this.cd.markForCheck();
                        }
                        else {
                            // account is created and is already activated => this user should login
                            this.isEmailAlreadyExist = true;
                            this.cd.markForCheck();
                        }
                    }
                    else {
                        // no matching email => create user
                        return this.userService.createUser(email, firstname, lastname, true)
                            .then((user: User) => {

                                return user;
                            }, (reason) => { return Promise.reject("Account creation failed") })
                            .then((user: User) => {
                                return this.userService.updateUserRole(user.user_id, UserRole[UserRole.Admin])
                                    .then(() => user)
                            }, (reason) => { return Promise.reject("Cannot set user role") })
                            .then((user: User) => {
                                return this.userService.sendConfirmation(user.email, user.user_id, user.firstname, user.lastname, user.name)
                                    .then((success: boolean) => {
                                        this.isConfirmationEmailSent = success;
                                        this.cd.markForCheck();
                                    },
                                    (reason) => { this.isConfirmationEmailSent = false; this.cd.markForCheck(); return Promise.reject("Confirmation email failed to send") })
                            })
                            .then(() => {
                                this.analytics.eventTrack("Sign up", { email: email, firstname: firstname, lastname: lastname });
                            }, () => { })
                            .catch((reason: any) => {
                                this.signUpMessageFail = `${reason}! Please email us at support@maptio.com and we'll help you out. `;
                                this.cd.markForCheck();
                            })
                    }
                }).then(() => { this.isLoading = false; })
        }
    }

    isEmailExist(email: string): Promise<boolean> {
        return this.userService.isUserExist(email)
    }


    isActivationPending(email: string, firstname: string, lastname: string) {
        return this.userService.isActivationPendingByEmail(email)
            .then(({ isActivationPending, user_id }) => {
                if (!user_id) {
                    return Promise.resolve({ isActivationPending: false, userToken: undefined })
                }
                // if (isActivationPending) {
                return this.userService.generateUserToken(user_id, email, firstname, lastname).then(token => {
                    return { isActivationPending, userToken: token }
                });
                // }
            })
    }

    resendEmail() {
        this.isResending = true;
        if (!this.userToken)
            return;
        this.userService.sendConfirmationWithUserToken(this.userToken).then(() => {
            this.isResending = false;
            this.cd.markForCheck();
        })
    }
}
