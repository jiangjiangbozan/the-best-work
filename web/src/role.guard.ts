import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from './service/shared-data.service';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  user_role = 0;
  constructor(
    private sharedDataService: SharedDataService
  ) {

    this.sharedDataService.currentRole.subscribe((user_role) => {
      this.user_role = user_role;
    })
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkRole();
  }
  
  checkRole() {
    if(this.user_role === 0) {
      return false;
    }
    return true;
  }
}
