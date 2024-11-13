import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { VariableService } from '../../services/variable/variable.service';

export const GetMenuKeyGuard: CanActivateFn = route => {
  const variableService = inject(VariableService);
  variableService.MENU_ACCESS_KEY.set(route.data['signature'] ?? '');
  return true;
};
