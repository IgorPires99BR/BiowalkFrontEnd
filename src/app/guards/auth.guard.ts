// src/app/guards/auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const userSectorName = userService.getUserSectorName();

  if (userSectorName) {
    return true;
  }

  // Se não houver setor de usuário, redireciona para o login
  router.navigate(['/login']);
  return false;
};