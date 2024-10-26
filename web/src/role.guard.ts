import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from './service/shared-data.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  user_role = 1;
  constructor(
    private sharedDataService: SharedDataService,
    private router: Router
  ) {

    this.sharedDataService.currentRole.subscribe((user_role) => {
      this.user_role = user_role;
      console.log('guard', this.user_role);
    })
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkRole();
  }
  
  checkRole() {
    
    if(this.user_role === 0) {
      return this.router.parseUrl('no-permission');
    }
    return true;
  }
}
