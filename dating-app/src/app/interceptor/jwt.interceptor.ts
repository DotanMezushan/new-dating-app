import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { take, switchMap, catchError } from 'rxjs/operators';
import { UserResponse } from '../models/login.model';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // The overall observable chain is returned from the function
  return authService.currentUser$.pipe(
    take(1),  // Take only the first emitted value and then complete
    switchMap((user: UserResponse | null) => {
      if (user) {
        // Modify the request to add the Authorization header
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
      }
      // Pass the (possibly modified) request to the next handler in the chain
      return next(req);
    }),
    // Error handling to log and continue the request without modification
    catchError(error => {
      console.error('Error in JWT Interceptor:', error);
      // Continue without modifying the request in case of an error
      return next(req);
    })
  );
};
