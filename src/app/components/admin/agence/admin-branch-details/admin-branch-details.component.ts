import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { ActivatedRoute } from '@angular/router';
import { CounterDetailsModele } from '../agence.models';
//import { Subject } from 'rxjs';
@Component({
  selector: 'app-admin-branch-details',
  standalone: true,
  imports: [],
  templateUrl: './admin-branch-details.component.html',
  styleUrl: './admin-branch-details.component.scss',
})
export class AdminBranchDetailsComponent implements OnInit {
  branchId!: number;
  branchDetails!: CounterDetailsModele | null;
  //private onDestroy$: Subject<void> = new Subject<void>();
  loadingData = false;
  constructor(
    private adminService: AdminService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('helooooooooooo');
    this.getBranchDetails();
  }
  getBranchDetails() {
    this.loadingData = true;
    this.adminService.getBranchDetails(2).subscribe({
      next: (response: { object: CounterDetailsModele }) => {
        this.loadingData = false;
        this.branchDetails = response.object;
      },
    });
  }
}
