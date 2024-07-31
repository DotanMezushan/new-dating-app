import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.getToken().length > 10) {
    return true;
  } else {
    authService.setLogOut();
    return false;
  }
};