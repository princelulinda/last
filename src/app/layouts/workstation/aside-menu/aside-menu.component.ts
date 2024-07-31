import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwitchModeComponent } from '../../../components/dev/switch-mode/switch-mode.component';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [RouterModule, NgClass, SwitchModeComponent],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss',
})
export class AsideMenuComponent {}
