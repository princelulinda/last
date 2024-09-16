import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { TellerDetailsModele } from '../agence.models';
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
  tellerDetails!: TellerDetailsModele | null;
  loadingData = false;
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.tellerId = params['id'];
      },
    });
    this.getTellerDetails();
  }

  refresh() {
    this.getTellerDetails();
    this.tellerDetails = null;
  }
  goBack(): void {
    this.location.back();
  }
  getTellerDetails() {
    this.loadingData = true;
    this.adminService.getTellerDetails(this.tellerId).subscribe({
      next: (response: { object: TellerDetailsModele }) => {
        this.loadingData = false;
        this.tellerDetails = response.object;
      },
    });
  }
}
