import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsListComponent } from '../accounts-list/accounts-list.component';
import { RouterOutlet } from '@angular/router';
import { accountsList } from '../models';
import { ConfigService } from '../../../core/services';
import { Observable, Subject } from 'rxjs';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AccountsListComponent, RouterOutlet, RouterLink],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit, OnDestroy {
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;
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
  handleAccountSelected(account: accountsList) {
    console.log('Compte sélectionné :', account);
  }
}
