import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../core/services';
import { Observable, Subject } from 'rxjs';
import { activeMainConfigModel } from '../../core/services/config/main-config.models';
import { Location } from '@angular/common';
@Component({
  selector: 'app-withdrawal',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss',
})
export class WithdrawalComponent implements OnInit, OnDestroy {
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;

  constructor(
    private configService: ConfigService,
    private location: Location
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  private onDestroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  goBack(): void {
    this.location.back();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
