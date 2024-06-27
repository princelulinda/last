import { Component, OnInit } from '@angular/core';
import { SkeletonComponent } from '../../../../global/skeleton/skeleton.component';
import { ConfigService, PlateformModel } from '../../../../core/services';
import { Observable } from 'rxjs';
import { FooterComponent } from '../../footer/footer.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [SkeletonComponent, FooterComponent, NgClass],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
})
export class AsideBarComponent implements OnInit {
  plateform!: PlateformModel;
  plateform$: Observable<PlateformModel>;

  constructor(private configService: ConfigService) {
    this.plateform$ = this.configService.getPlateform();
  }

  ngOnInit() {
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
      },
    });
  }

  switchPlateform(name: PlateformModel) {
    this.configService.switchPlateform(name);
  }
}
