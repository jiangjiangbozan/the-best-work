import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from './service/shared-data.service';
import { Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from './service/user.service';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  user_role = 0;
  constructor(
    private sharedDataService: SharedDataService,
    private router: Router,
    private userService: UserService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     return  this.userService.getUserRole().pipe(
      map(user_role => {
        this.user_role = user_role; // 注意：在守卫中通常不推荐设置组件的状态
        // 假设checkRole是一个根据user_role返回Observable<boolean | UrlTree>的方法
        return this.checkRole(); 
      }

      )
     )
  }

  checkRole() {
    if(this.user_role === 0) {
      return this.router.parseUrl('no-permission');
    }
    return true;
  }
}
