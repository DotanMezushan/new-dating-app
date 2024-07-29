import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { take, switchMap, catchError, of, throwError } from 'rxjs';
import { UserResponse } from '../models/login.model';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if(authService.isAuthenticated){
    return authService.currentUser$.pipe(
      take(1),
      switchMap((user: UserResponse | null) => {
        console.log('JWT Interceptor - Current User:', user);
        if (user && user.token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
          console.log('JWT Interceptor - Modified Request:', req);
        } else {
          console.warn('JWT Interceptor - No User Token Found');
        }
        return next(req); // Pass the request to the next handler
      }),
      catchError(error => {
        console.error('Error in JWT Interceptor:', error);
        return throwError(error); // Rethrow the error after logging
      })
    );
  }else{
    return next(req); 
  }
 
};
