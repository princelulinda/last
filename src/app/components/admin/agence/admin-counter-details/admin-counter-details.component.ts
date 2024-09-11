import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { CounterDetailsModele } from '../agence.models';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';

@Component({
  selector: 'app-admin-counter-details',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent],
  templateUrl: './admin-counter-details.component.html',
  styleUrl: './admin-counter-details.component.scss',
})
export class AdminCounterDetailsComponent implements OnInit {
  counterId!: number;
  counterDetails!: CounterDetailsModele | null;
  private onDestroy$: Subject<void> = new Subject<void>();
  loadingData = false;
  constructor(
    private adminService: AdminService,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.counterId = params['id'];
      },
    });
    this.getCounterDetails();
  }
  goBack(): void {
    this.location.back();
  }

  refresh() {
    this.getCounterDetails();
    this.counterDetails = null;
  }
  getCounterDetails() {
    this.loadingData = true;
    this.adminService.getBranchDetails(2).subscribe({
      next: (response: { object: CounterDetailsModele }) => {
        this.loadingData = false;
        this.counterDetails = response.object;
      },
    });
  }
}
