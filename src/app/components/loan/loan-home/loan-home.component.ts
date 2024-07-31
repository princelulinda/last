import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService } from '../../../core/services';
import { Observable, Subject } from 'rxjs';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
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
    this.mainConfig$ = this.configService.getMainConfig();
  }
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;
  private onDestroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
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
