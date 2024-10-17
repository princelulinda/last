import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../../core/services';
import { Observable, Subject } from 'rxjs';
import { ActiveMainConfigModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-nyamuranzi-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nyamuranzi-details.component.html',
  styleUrl: './nyamuranzi-details.component.scss',
})
export class NyamuranziDetailsComponent implements OnInit, OnDestroy {
  activePlatform: string | null = null;
  mainConfig$!: Observable<ActiveMainConfigModel>;
  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

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
}
