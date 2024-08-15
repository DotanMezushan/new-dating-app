import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snackbarService = inject(SnackbarService);
  return authService.currentUser$.pipe(
    map(user =>{
      if(user?.roles?.includes("admin")|| user?.roles?.includes("Moderator") ){
        return true;
      }
      snackbarService.showSnackbar("you can not be in tthis area", null, 3000);
      return false;
    })
  )
};
