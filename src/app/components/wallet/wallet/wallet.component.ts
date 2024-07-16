import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WalletListComponent } from '../wallet-list/wallet-list.component';
import { ClientService } from '../../../core/services/client/client.service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [RouterOutlet, WalletListComponent],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
})
export class WalletComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  hasWalletList = false;
  isWalletDetailsShown = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.isDetailsWalletShown$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isDetailWalletShown => {
        this.isWalletDetailsShown = isDetailWalletShown;
      });

    this.clientService.hasWalletList$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.hasWalletList = value;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.clientService.isWalletList(false);
  }
}
