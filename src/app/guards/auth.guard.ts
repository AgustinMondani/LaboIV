import { CanActivateFn, Router, CanActivate } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const AuthGuard: CanActivateFn = async () => {
  const supabase = inject(AuthService);
  const router = inject(Router);

  const { data } = await supabase.client.auth.getSession();

  if (!data.session) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

