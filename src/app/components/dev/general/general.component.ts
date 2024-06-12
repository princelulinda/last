import { Component } from '@angular/core';
import { BankingComponent } from '../../layouts/banking/banking.component';

@Component({
  selector: 'app-general',
  standalone: true,
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  imports: [BankingComponent],
})
export class GeneralComponent {
  protected plateform = 'workstation';
}
