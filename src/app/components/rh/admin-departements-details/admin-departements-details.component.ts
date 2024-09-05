import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin/admin.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminDepartementsDetailsModel } from '../rh.model';

@Component({
  selector: 'app-admin-departements-details',
  standalone: true,
  imports: [],
  templateUrl: './admin-departements-details.component.html',
  styleUrl: './admin-departements-details.component.scss',
})
export class AdminDepartementsDetailsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  depId!: string | number;
  depDetails!: AdminDepartementsDetailsModel;
  loadingData = true;
  defaultDirectionId!: string;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.depId = params['id'];
        this.getDepDetails();
      },
    });
  }

  getDepDetails() {
    this.adminService
      .getDepartmentDetails(this.depId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          console.log(data);
          this.depDetails = data;
          this.loadingData = false;
          // this.defaultDirectionId = this.depDetails.direction;
          // this.name.setValue(this.depDetails.name);
        },
        error: () => {
          // console.log(error);
          this.loadingData = false;
        },
      });
  }
}
