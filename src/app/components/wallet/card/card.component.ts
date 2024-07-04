import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  showAmountWallet = false;

  //   defaultWallet={};
  //   noWalletData = false;

  //   constructor(@Inject(BankingService) private bankingService: BankingService) {

  //   }
  //   ngOnInit(): void {
  //   this.getDefaultWallet();

  //   }

  //   getDefaultWallet() {

  //     this.bankingService.getDefaultWallet().subscribe({
  //         next: (defaultWallet) => {
  //             this.defaultWallet = defaultWallet.object.response_data;

  //             if (defaultWallet.object.success === false) {
  //                 this.noWalletData = true;
  //             }

  //         },
  //         error: (error) => {

  //             error = 'Data not Found';
  //         },
  //     });
  // }
}
