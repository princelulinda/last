import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WalletListComponent } from '../wallet-list/wallet-list.component';

import { RouterOutlet } from '@angular/router';
import { WalletModel } from '../../wallet.models';
import { DialogService } from '../../../../core/services';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../../../core/services';
import { ActiveMainConfigModel } from '../../../../core/services/config/main-config.models';
@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [RouterOutlet, WalletListComponent, RouterLink],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
})
export class WalletComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  hasWalletList = false;

  showAmounts = false; // Variable to store the visibility state of amounts
  showAmounts$: Observable<boolean>; // Observable for the visibility state
  selectedWallet: WalletModel | null = null;
  dataLoaded = false;
  activePlatform: string | null = null;
  mainConfig$!: Observable<ActiveMainConfigModel>;
  constructor(
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.showAmounts$ = this.dialogService.getAmountState();
    this.mainConfig$ = this.configService.getMainConfig();
  }

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

  handleWalletSelected(wallet: WalletModel) {
    this.selectedWallet = wallet;

    //console.log('Compte sélectionné :', wallet);
  }

  handleDataLoaded(loaded: boolean) {
    this.dataLoaded = loaded;
  }
  toggleAmountVisibility() {
    this.dialogService.displayAmount();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
