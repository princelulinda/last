import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin/admin.service';
import { AdminDirectionsDetailsModel } from '../rh.model';

@Component({
  selector: 'app-admin-direction-details',
  standalone: true,
  imports: [],
  templateUrl: './admin-direction-details.component.html',
  styleUrl: './admin-direction-details.component.scss',
})
export class AdminDirectionDetailsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  directionId!: string | number;
  directionDetails!: AdminDirectionsDetailsModel;
  loadingData = true;

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.directionId = params['id'];
        this.getDirectionDetails();
      },
    });
  }

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute
  ) {}
  // object_id!:string;
  getDirectionDetails() {
    this.loadingData = true;
    this.adminService
      .getDirectionDetails(this.directionId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.directionDetails = data;
          // this.object_id = this.directionDetails.id;
          this.loadingData = false;
        },
        error: () => {
          this.loadingData = false;
        },
      });
  }
}
