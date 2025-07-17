import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';

export const authGuard : CanActivateChildFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkSession().pipe(
    map(res => {
      if (res.status === 200)
        return true;
      else
        return router.createUrlTree(['/login']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};
