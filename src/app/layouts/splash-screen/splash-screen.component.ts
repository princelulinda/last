import { Component, OnInit } from '@angular/core';
import { ConfigService, PlateformModel } from '../../core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
})
export class SplashScreenComponent implements OnInit {
  plateform$: Observable<PlateformModel>;
  plateform!: PlateformModel;

  imageUrl = '/images/ihela3.png';

  constructor(private configService: ConfigService) {
    this.plateform$ = this.configService.getPlateform();
  }

  ngOnInit() {
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
        if (plateform === 'workstation') {
          this.imageUrl = '/images/magis.png';
        }
      },
    });
  }
}
