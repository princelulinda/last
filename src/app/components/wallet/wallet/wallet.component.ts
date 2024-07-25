import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WalletListComponent } from '../wallet-list/wallet-list.component';

import { RouterOutlet } from '@angular/router';
import { WalletList } from '../wallet.models';
import { DialogService } from '../../../core/services';
import { RouterLink } from '@angular/router';
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
  selectedWallet: WalletList | null = null;
  dataLoaded = false;
  constructor(private dialogService: DialogService) {
    this.showAmounts$ = this.dialogService.getAmountState();
  }

  ngOnInit(): void {
    this.showAmounts$.subscribe(state => {
      this.showAmounts = state;
    });
  }

  handleWalletSelected(wallet: WalletList) {
    this.selectedWallet = wallet;

    console.log('Compte sélectionné :', wallet);
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
