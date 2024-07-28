import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { take, switchMap } from 'rxjs';
import { UserResponse } from '../models/login.model';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    switchMap((user: UserResponse | null) => {
      if (user) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
      }
      return next(req);
    })
  );
};
