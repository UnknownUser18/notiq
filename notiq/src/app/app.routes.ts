import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'api', redirectTo: '' }, // Redirect API to root
  { path: '' , redirectTo: 'login', pathMatch: 'full' }, // Redirect root to login (temporary)
  { path: 'login', component: LoginComponent },
];
