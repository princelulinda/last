import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { MenuGroupsModel } from '../../../core/db/models/menu/menu.models';
import { ConfigService } from '../../../core/services';

@Component({
  selector: 'app-intranet-layout',
  standalone: true,
  imports: [],
  templateUrl: './intranet-layout.component.html',
  styleUrl: './intranet-layout.component.scss',
})
export class IntranetLayoutComponent implements OnInit {
  menuGroups: MenuGroupsModel[] = [];
  private menuGroups$: Observable<MenuGroupsModel[]>;

  constructor(private configService: ConfigService) {
    this.menuGroups$ = this.configService.getMenuGroups();
  }

  ngOnInit(): void {
    this.menuGroups$.subscribe({
      next: menus => {
        if (menus) {
          this.menuGroups = menus;
        }
      },
    });
  }
}
