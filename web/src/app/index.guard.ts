import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, } from 'rxjs';
import { SharedDataService } from 'src/service/shared-data.service';
import { UserService } from 'src/service/user.service';
import { switchMap ,catchError} from 'rxjs/operators';  
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexGuard implements CanActivate {
  
  constructor(
    private shareDataService : SharedDataService,
    private userService : UserService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   return this.userService.isLogin().pipe(
    switchMap(user_id => {
      this.shareDataService.setId(user_id);
      return of(true);
    }),
    catchError(error => {
      // 处理错误，例如重定向到登录页或显示错误消息
      // 这里我们简单地返回false来阻止导航
      this.router.navigate(['/login']); // 假设有一个登录页
      return of(false); // 虽然这里返回false可能不会影响导航，因为router.navigate已经触发
      // 但在某些情况下，这可以帮助保持代码的一致性
    }))
  }
  
}
