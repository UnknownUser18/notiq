import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';

@Component({
  selector: 'app-nav',
  imports : [
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  protected readonly faCog = faCog;
  protected readonly faHome = faHome;
}
