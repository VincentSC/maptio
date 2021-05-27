
import {map} from 'rxjs/operators';
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import {
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Auth } from "../authentication/auth.service";
import { Intercom } from "ng-intercom";
import { environment } from "../../config/environment";
import { User } from "../../shared/model/user.data";

@Injectable()
export class AccessGuard implements CanActivate, CanActivateChild {
  constructor(
    private auth: Auth,
    private router: Router,
    private intercom: Intercom
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let dataset = route.params["mapid"];
    let team = route.params["teamid"];

    return this.auth.getUser().pipe(map(u => {
      if (dataset && u.datasets.includes(dataset)) {
        this.updateIntercom(u.teams, u);
        return true;
      } else if (team && u.teams.includes(team)) {
        this.updateIntercom(u.teams, u);
        return true;
      } else {
        this.router.navigate(["/unauthorized"]);
        return false;
      }
    }));
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

  private updateIntercom(teams: string[], user: User) {
    const nonExampleTeams = teams.filter(
      t => user.exampleTeamIds.findIndex(e => e === t) < 0
    );

    if (nonExampleTeams.length === 1) {
      // we'll worry about consultants later

      nonExampleTeams.forEach(t => {
        this.intercom.update({
          app_id: environment.INTERCOM_APP_ID,
          email: user.email,
          user_id: user.user_id,
          company: {
            company_id: t
          }
        });
      });
    }
  }
}
