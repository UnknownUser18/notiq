import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { TranslateService, TranslatePipe, TranslateDirective } from "@ngx-translate/core";

@Component({
  selector : 'app-root',
  imports : [
    LoginComponent,
    TranslatePipe,
    TranslateDirective
  ],
  templateUrl : './app.component.html',
  styleUrl : './app.component.scss'
})
export class AppComponent {
  title = 'notiq';

  constructor(private translate : TranslateService) {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang && browserLang.match(/en|pl/) ? browserLang : 'en');

  }
}
