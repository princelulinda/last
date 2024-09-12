import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { BranchDetailsModele } from '../agence.models';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-branch-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-branch-details.component.html',
  styleUrl: './admin-branch-details.component.scss',
})
export class AdminBranchDetailsComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  loadingData = false;
  brancId!: number;
  branchDetails!: BranchDetailsModele | null;
  private onDestroy$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.brancId = params['id'];
      },
    });

    this.getBranchDetails();
  }
  goBack(): void {
    this.location.back();
  }
  refresh() {
    this.getBranchDetails();
    this.branchDetails = null;
  }
  getBranchDetails() {
    this.loadingData = true;
    this.adminService.getBranchDetails(2).subscribe({
      next: (response: { object: BranchDetailsModele }) => {
        this.loadingData = false;
        this.branchDetails = response.object;
      },
    });
  }
}
