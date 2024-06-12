import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [NgClass],
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent {
  plateform = '';
  isMymarket = true;

  switchPlateform(name: string) {
    this.plateform = name;
  }
}
