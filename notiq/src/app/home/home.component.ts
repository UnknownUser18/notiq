import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { InfoService, User } from '../services/info.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { catchError, map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector : 'app-home',
  imports : [],
  templateUrl : './home.component.html',
  styleUrl : './home.component.scss'
})
export class HomeComponent {
  protected username : string | null = null;


  constructor(
    private authService : AuthService,
    private info : InfoService,
    private router : Router,
    private translate : TranslateService
  ) {
    this.translate.get('title.main').pipe(take(1)).subscribe(title => this.info.setTitle(title));
    this.authService.checkSession().pipe(
      map((res : HttpResponse<object>) => res.status === 200 ? (res.body as User).username : null),
      take(1),
      catchError(() => {return [null];})
    ).subscribe(username => this.username = username);
  }

  protected getWelcomeMessage(name : string) : string {
    const hour = new Date().getHours();
    let key = 'main.welcome.';
    key += hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'day' : 'night';
    let message = '';
    this.translate.get(key, { name }).pipe(take(1)).subscribe(res => (message = res));
    return message;
  }

}
