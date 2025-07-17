import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { faBell, faCog, faMagnifyingGlass, faMessage, faPenToSquare, faUser } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';

@Component({
  selector : 'app-nav',
  imports : [
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  host : {
    role : 'navigation',
  },
  templateUrl : './nav.component.html',
  styleUrl : './nav.component.scss'
})
export class NavComponent {
  protected readonly faCog = faCog;
  protected readonly faHome = faHome;
  protected readonly faUserFriends = faUserFriends;
  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faBell = faBell;
  protected readonly faMessage = faMessage;
  protected readonly faUser = faUser;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
}
