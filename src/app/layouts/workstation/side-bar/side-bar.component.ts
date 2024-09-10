import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services';
import { PageMenusModel } from '../../../components/admin/menu/menu.models';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TooltipDirective } from '../../../components/dev/tooltip.directive';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, TooltipDirective],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
  activeMenus: PageMenusModel[] = [];
  activeMenus$: Observable<PageMenusModel[]>;

  constructor(private menuService: MenuService) {
    this.activeMenus$ = this.menuService.getPageMenus();
  }

  ngOnInit() {
    this.activeMenus$.subscribe({
      next: menus => {
        this.activeMenus = menus;
      },
    });
  }
}
