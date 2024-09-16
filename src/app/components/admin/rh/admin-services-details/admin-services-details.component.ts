import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { AdminServicesDetailsModel } from '../rh.model';

@Component({
  selector: 'app-admin-services-details',
  standalone: true,
  imports: [],
  templateUrl: './admin-services-details.component.html',
  styleUrl: './admin-services-details.component.scss',
})
export class AdminServicesDetailsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  serviceId!: string | number;
  loadingData = true;
  serviceDetails!: AdminServicesDetailsModel;
  object_id!: string;
  defaultDepartmentId!: string;

  name = new FormControl('', Validators.required);

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.serviceId = params['id'];
        this.getServiceDetails();
      },
    });
  }

  getServiceDetails() {
    this.loadingData = true;
    this.adminService
      .getServiceDetails(this.serviceId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: AdminServicesDetailsModel) => {
          this.serviceDetails = data;
          this.object_id = this.serviceDetails.id;
          //   this.name.setValue(this.serviceDetails.name);
          this.defaultDepartmentId = this.serviceDetails.department;
          this.loadingData = false;
        },
        error: error => {
          console.log(error);
          this.loadingData = false;
        },
      });
  }
}
