import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsListComponent } from '../accounts-list/accounts-list.component';
import { RouterOutlet } from '@angular/router';
import { AccountsListModel } from '../models';
import { ConfigService } from '../../../core/services';
import { Observable, Subject } from 'rxjs';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../../core/services';
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
  dataLoaded = false;
  showAmounts = false; // Variable to store the visibility state of amounts
  showAmounts$: Observable<boolean>; // Observable for the visibility state
  selectedAccount: AccountsListModel | null = null;
  constructor(
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.showAmounts$ = this.dialogService.getAmountState();
    this.mainConfig$ = this.configService.getMainConfig();
  }
  private onDestroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });

    this.showAmounts$.subscribe(state => {
      this.showAmounts = state;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleWalletSelected(account: AccountsListModel) {
    this.selectedAccount = account;

    console.log('Compte sélectionné :', account);
  }

  handleDataLoaded(loaded: boolean) {
    this.dataLoaded = loaded;
  }
  toggleAmountVisibility() {
    this.dialogService.displayAmount();
  }
}
