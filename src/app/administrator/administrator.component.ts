import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../services/user.service';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css',
  "/base.scss.css",
  "./responsive.scss.css",
  "./bootstrap.css",
  "./themify-icons.css",
  "./bootstrap.min.css",
  "./font-awesome.min.css",
  "./style.scss.css",
  "./module.scss.css",
  "./bpr-products-module.css",
  "./main.min.css"
]
})
export class AdministratorComponent implements OnInit {
  @Input() user: User;
  constructor(
    private userService: UserService,
    public auth: AuthService,
    private route: Router
    ) { }
  
  login(id: string, password: string): void {
  id = id.trim();
  password = password.trim();
  if (!id) { return; }
  //this.userService.userLogin(id, password);
}
  ngOnInit() {
    if(this.auth.user){
      if(this.auth.isSuperAdmin){
        this.auth.user.subscribe(_ => (this.user = _));
      }
      else
      this.route.navigate[('/')];
  }

}
}