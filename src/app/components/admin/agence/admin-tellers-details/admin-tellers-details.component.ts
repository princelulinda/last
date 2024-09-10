import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { TellerDetailsModele } from '../agence.models';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';
@Component({
  selector: 'app-admin-tellers-details',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent],
  templateUrl: './admin-tellers-details.component.html',
  styleUrl: './admin-tellers-details.component.scss',
})
export class AdminTellersDetailsComponent implements OnInit {
  tellerId!: number;
  tellerDetails!: TellerDetailsModele;
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params: Params) => {
        // Assurez-vous que 'tontineId' est un nombre en utilisant l'opérateur '+'
        this.tellerId = params['tellerid'];
      },
    });
    this.getTellerDetails();
  }

  getTellerDetails() {
    this.adminService.getTellerDetails(14).subscribe({
      next: (response: { object: TellerDetailsModele }) => {
        this.tellerDetails = response.object;
        //console.log('Données de tontine:', this.tellerDetailData);
      },
    });
  }
}
