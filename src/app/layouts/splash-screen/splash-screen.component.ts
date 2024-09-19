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
  isAnimated = false;

  imageUrl = '/images/logo/ihela-ryanje.png';

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
        // this.isAnimated = true;
        this.startAnimationLoop();
      } else {
        this.splashScreenElement?.classList.add('fade');
        this.splashScreenElement?.classList.remove('show');
        this.isAnimated = false;
      }
    });
  }

  ngOnInit() {
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
        if (plateform === 'workstation') {
          this.imageUrl = '/images/logo/magis-erp.png';
        }
      },
    });
  }

  ngAfterViewInit() {
    this.splashScreenElement = document.getElementById('splashScreen');
  }

  startAnimationLoop() {
    const animationCycle = () => {
      this.isAnimated = true;
      setTimeout(() => {
        this.isAnimated = false;

        if (this.splashScreenState) {
          setTimeout(animationCycle, 100);
        }
      }, 6000);
    };

    animationCycle();
  }
}
