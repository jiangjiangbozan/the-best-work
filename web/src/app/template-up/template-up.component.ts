
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../service/user.service';
import * as Notiflix from 'notiflix';
import { SharedDataService } from 'src/service/shared-data.service';
import {DefaultUrlSerializer, NavigationEnd, Router, UrlSerializer} from "@angular/router";
@Component({
  selector: 'app-template-up',
  templateUrl: './template-up.component.html',
  styleUrls: ['./template-up.component.css']
})
export class TemplateUpComponent implements OnInit {
  @Output()
  beLogout = new EventEmitter<any>();

  user_role = 0;
  user_name = 'root';
  user_id = 0;
  activeRouterLink: string = '';

  constructor(
    private userService: UserService,
    private sharedDataService: SharedDataService,private router: Router, private urlSerializer: UrlSerializer = new DefaultUrlSerializer(),
  ) { }

  ngOnInit(): void {
    this.sharedDataService.currentId.subscribe((user_id) => {
      this.user_id = user_id;
      this.userService.getUser(this.user_id).subscribe((user) => {
        this.user_name = user['name'];
      })
    });
    this.sharedDataService.currentRole.subscribe((user_role) => {
      this.user_role =user_role;
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // 将当前路由的UrlTree转换为字符串
        // @ts-ignore
        const currentUrl = this.urlSerializer.serialize(event.url);
        // 去除查询参数（可选）
        this.activeRouterLink = currentUrl.split('?')[0];
      }
    });
  }

  setActiveLink(link: string): void {
    this.activeRouterLink = link;
    this.router.navigate([link]);
  }

  onLogout(): void {
    Notiflix.Loading.standard('请稍候');
    this.userService.logout().subscribe(() => {
      this.beLogout.emit();
      Notiflix.Loading.remove();
    })
  }

}
