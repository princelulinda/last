import { Component } from '@angular/core';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss',
  imports: [ProfileCardComponent],
})
export class BeneficiariesComponent {}
