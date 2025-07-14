import { Component } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports : [
    NavComponent,
    RouterOutlet
  ],
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {

}
