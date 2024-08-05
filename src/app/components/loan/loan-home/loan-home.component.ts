import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService } from '../../../core/services';
import { Observable, Subject } from 'rxjs';
import { PlateformModel } from '../../../core/services/config/main-config.models';
@Component({
  selector: 'app-loan-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './loan-home.component.html',
  styleUrl: './loan-home.component.scss',
})
export class LoanHomeComponent implements OnInit, OnDestroy {
  constructor(
    private _location: Location,
    private configService: ConfigService
  ) {
    this.activePlatform$ = this.configService.getPlateform();
  }
  activePlatform!: PlateformModel;
  activePlatform$!: Observable<PlateformModel>;
  private onDestroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.activePlatform$.subscribe({
      next: plateform => {
        this.activePlatform = plateform;
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goBack() {
    this._location.back();
  }
}
