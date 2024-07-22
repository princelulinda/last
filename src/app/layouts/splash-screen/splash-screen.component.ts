import { AfterViewInit, Component, effect, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigService, DialogService } from '../../core/services';
import { PlateformModel } from '../../core/services/config/main-config.models';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
})
export class SplashScreenComponent implements OnInit, AfterViewInit {
  plateform$: Observable<PlateformModel>;
  plateform!: PlateformModel;

  splashScreenElement: HTMLElement | null = null;
  splashScreenState = false;

  imageUrl = '/images/auth/ihela3.png';

  constructor(
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.plateform$ = this.configService.getPlateform();
    effect(() => {
      this.splashScreenState = this.dialogService.splashScreen();
      if (this.splashScreenState) {
        this.splashScreenElement?.classList.add('show');
        this.splashScreenElement?.classList.remove('fade');
      } else {
        this.splashScreenElement?.classList.add('fade');
        this.splashScreenElement?.classList.remove('show');
      }
    });
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

  ngAfterViewInit() {
    this.splashScreenElement = document.getElementById('splashScreen');
  }
}
