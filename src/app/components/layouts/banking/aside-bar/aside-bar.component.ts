import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
})
export class AsideBarComponent {
  plateform = '';

  switchPlateform(name: string) {
    this.plateform = name;
  }
}
