import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Router, RouterOutlet } from '@angular/router';
import { InfoService } from './services/info.service';
import { take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector : 'app-root',
  imports : [
    RouterOutlet,
  ],
  templateUrl : './app.component.html',
  styleUrl : './app.component.scss',
})
export class AppComponent {

  constructor(
    private translate : TranslateService,
    private info : InfoService,
    private authService : AuthService,
    private router : Router) {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang && browserLang.match(/en|pl/) ? browserLang : 'en');
    this.translate.get('title.application').pipe(take(1)).subscribe(title => this.info.setTitle(title));
    this.authService.checkSession().subscribe({
      next : result => {
        if (result.status !== 200)
          this.router.navigate(['/login']).then();
      },
      error : error => {
        if (error.status === 403)
          this.router.navigate(['/login']).then();
      }
    });
  }
}
