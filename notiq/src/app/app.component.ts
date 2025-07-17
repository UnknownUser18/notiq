import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { RouterOutlet } from '@angular/router';
import { InfoService } from './services/info.service';
import { take } from 'rxjs/operators';

@Component({
  selector : 'app-root',
  imports : [
    RouterOutlet
  ],
  templateUrl : './app.component.html',
  styleUrl : './app.component.scss',
})
export class AppComponent {

  constructor(
    private translate : TranslateService,
    private info : InfoService) {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang && browserLang.match(/en|pl/) ? browserLang : 'en');
    this.translate.get('title.application').pipe(take(1)).subscribe(title => this.info.setTitle(title));
  }
}
