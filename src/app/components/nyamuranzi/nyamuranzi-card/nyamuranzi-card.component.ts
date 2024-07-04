import { Component } from '@angular/core';

@Component({
  selector: 'app-nyamuranzi-card',
  standalone: true,
  imports: [],
  templateUrl: './nyamuranzi-card.component.html',
  styleUrl: './nyamuranzi-card.component.scss',
})
export class NyamuranziCardComponent {
  //   showAmountAccount = false;
  // referees={};
  //   noRefereed = false;
  // account={};
  // constructor(@Inject(BankingService) private bankingService: BankingService) {
  // }
  // ngOnInit(): void {
  // //   this.bankingService.getRefereePersons().subscribe((referees: any) => {
  // //     this.referees = referees.object.response_data;
  // //     if (!referees.object.success) {
  // //         this.noRefereed = true;
  // //     }
  // // });
  // // this.getDefaultAccount();
  // }
  // getDefaultAccount() {
  //   this.bankingService.getDefaultAccount().subscribe({
  //       next: (data) => {
  //           this.account = data;
  //       },
  //       error: (error) => {
  //           error = 'Data not Found';
  //       },
  //   });
  // }
}
