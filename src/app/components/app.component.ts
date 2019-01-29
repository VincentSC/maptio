import { Subscription } from "rxjs/Subscription";
import { LoaderService } from "./../shared/services/loading/loader.service";
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterEvent } from "@angular/router";
import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { HelpComponent } from "../components/help/help.component";
import "rxjs/add/operator/map"
import { Auth } from "../shared/services/auth/auth.service";
import { environment } from "../../environment/environment";
import { Observable } from "rxjs/Rx";
import { Intercom } from 'ng-intercom';
import { NgProgress } from '@ngx-progressbar/core';
import { URIService } from "../shared/services/uri.service";
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {

  public isHome: boolean;
  public isMap: boolean;

  public navigationStartSubscription: Subscription;
  public navigationOtherSubscription: Subscription;
  public checkTokenSubscription: Subscription;

  @ViewChild("help")
  helpComponent: HelpComponent;

  constructor(public auth: Auth, private router: Router, public progress: NgProgress,
    public intercom: Intercom, private deviceService: DeviceDetectorService, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {

    this.checkTokenSubscription = Observable
      .interval(environment.CHECK_TOKEN_EXPIRATION_INTERVAL_IN_MINUTES * 60 * 1000)
      .timeInterval()
      .flatMap(() => { return Observable.of(this.auth.allAuthenticated()) })
      .filter(isExpired => !isExpired)
      .subscribe((isExpired: boolean) => {
        this.router.navigateByUrl("/logout")
      });

    this.intercom.boot({ app_id: environment.INTERCOM_APP_ID });

    window.onresize = (e: UIEvent) => {
      this.isMobile();
      this.cd.markForCheck();
    }
  }

  ngOnDestroy() {
    if (this.checkTokenSubscription) this.checkTokenSubscription.unsubscribe();
  }

  isMobile() {
    console.log(this.deviceService.isMobile(), window.innerWidth)
    return this.deviceService.isMobile() || window.innerWidth < 500;
  }

}


