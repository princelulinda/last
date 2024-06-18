import { Component } from '@angular/core';

import { SkeletonComponent } from '../../../../global/skeleton/skeleton.component';
@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
})
export class AsideBarComponent {
  plateform = 'home';

  switchPlateform(name: string) {
    this.plateform = name;
  }
}
