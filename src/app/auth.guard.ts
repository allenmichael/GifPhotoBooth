import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AmplifyService } from 'aws-amplify-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private amplify: AmplifyService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return fromPromise(this.amplify.auth().currentAuthenticatedUser())
      .pipe(
        map(result => {
          return true;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }
}
