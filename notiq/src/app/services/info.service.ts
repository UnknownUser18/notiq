import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn : 'root'
})
export class InfoService {

  constructor(@Inject(PLATFORM_ID) private platform : Object, private title : Title) {
  }

  public setTitle(title : string) : void {
    if (!isPlatformBrowser(this.platform)) return;
    this.title.setTitle(title);
  }
}
