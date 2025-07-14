import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  readonly id : number
  username : string
  password : string
}

@Injectable({
  providedIn : 'root'
})
export class InfoService {

  constructor(@Inject(PLATFORM_ID) private platform : object, private title : Title) {
  }

  public setTitle(title : string) : void {
    if (!isPlatformBrowser(this.platform)) return;
    this.title.setTitle(title);
  }
}
