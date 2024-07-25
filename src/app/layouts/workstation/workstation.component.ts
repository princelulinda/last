import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';

@Component({
  selector: 'app-workstation',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AsideMenuComponent,
    SideBarComponent,
    RouterModule,
  ],
  templateUrl: './workstation.component.html',
  styleUrl: './workstation.component.scss',
})
export class WorkstationComponent {}
