import { inject, Injectable } from '@angular/core';
import type { Resolve } from '@angular/router';
import { ConfigService, DialogService, MenuService } from '../../services';
import { map, Observable } from 'rxjs';
import { AccessModel } from '../../../components/admin/access/access.models';

@Injectable({ providedIn: 'root' })
export class HeroResolver implements Resolve<AccessModel[]> {
  menuService = inject(MenuService);
  dialogService = inject(DialogService);
  configService = inject(ConfigService);

  resolve():
    | Observable<AccessModel[]>
    | Promise<AccessModel[]>
    | AccessModel[] {
    this.dialogService.dispatchLoading('topLoader');
    return this.menuService.getAccesses().pipe(
      map(data => {
        this.configService.setActiveAccesses(data.objects);
        this.dialogService.closeLoading();
        return data.objects;
      })
    );
  }
}
