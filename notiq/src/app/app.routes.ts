import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { EmptyLayoutComponent } from './layout/empty-layout/empty-layout.component';
import { authGuard } from './guards/auth.guard';
export const routes : Routes = [
  { path : 'api', redirectTo : '', pathMatch : "full" }, // Redirect API to root
  {
    path : '',
    component : MainLayoutComponent,
    canActivateChild : [ authGuard ],
    children : [
      { path : '', component : HomeComponent }
    ]
  },
  {
    path : '',
    component : EmptyLayoutComponent,
    children : [
      { path : 'login', component : LoginComponent },
    ]
  }
];
