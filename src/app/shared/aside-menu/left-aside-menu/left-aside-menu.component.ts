import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-left-aside-menu',
  standalone: true,
  imports: [NgClass],
  templateUrl: './left-aside-menu.component.html',
  styleUrls: ['./left-aside-menu.component.scss'],
})
export class LeftAsideMenuComponent {
  plateform = '';
  isMymarket = true;

  switchPlateform(name: string) {
    this.plateform = name;
  }
}
