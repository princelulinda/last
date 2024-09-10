import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { TreaureDetailsModele } from '../agence.models';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-admin-treasure-details',
  standalone: true,
  imports: [ProfileCardComponent],
  templateUrl: './admin-treasure-details.component.html',
  styleUrl: './admin-treasure-details.component.scss',
})
export class AdminTreasureDetailsComponent implements OnInit {
  treasureId!: number;
  treasurerDetails!: TreaureDetailsModele;
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.treasureId = params['id'];
      },
    });
    this.getTreasureDetails();
  }

  goBack(): void {
    this.location.back();
  }

  getTreasureDetails() {
    this.adminService.getTreasureDetails(this.treasureId).subscribe({
      next: (response: { object: TreaureDetailsModele }) => {
        this.treasurerDetails = response.object;
      },
    });
  }
}
