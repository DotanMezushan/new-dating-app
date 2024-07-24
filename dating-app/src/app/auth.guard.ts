import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // Check if user is authenticated (replace with your authentication logic)
  if (authService.isAuthenticated) {
    return true;
  } else {
    authService.setLogOut();
    return false;
  }
};