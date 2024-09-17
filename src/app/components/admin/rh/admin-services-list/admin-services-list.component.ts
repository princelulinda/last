import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { CreateNewServiceBodyModel, CreateNewServiceModel } from '../rh.model';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-services-list',
  standalone: true,
  imports: [ListComponent, ReactiveFormsModule, LookupComponent],
  templateUrl: './admin-services-list.component.html',
  styleUrl: './admin-services-list.component.scss',
})
export class AdminServicesListComponent implements OnInit {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/service/',
        field: 'id',
      },
    },

    {
      name: 'Department',
      field: ['department.name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/department/',
        field: 'department.id',
      },
    },
    {
      name: 'Direction',
      field: ['department.direction.name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/direction/',
        field: 'department.direction.id',
      },
    },
    {
      name: 'Direction Type',
      field: ['department.direction.direction_type.title'],
      size: '',
      icon: 'department.direction.direction_type.icon',
      css: 'department.direction.direction_type.css',
    },
  ];
  id!: number | null;
  isLoading = false;
  constructor(
    private adminService: AdminService,
    private dialogService: DialogService,
    private route: ActivatedRoute
  ) {}
  newService = new FormGroup({
    serviceName: new FormControl('', Validators.required),
  });

  newServiceData!: CreateNewServiceModel;
  createNewService() {
    this.isLoading = true;
    const body: CreateNewServiceBodyModel = {
      name: this.newService.value.serviceName,
      department: this.id,
      disallow_connexion: false,
    };
    this.adminService.createNewService(body).subscribe({
      next: data => {
        this.newServiceData = data.object;
        this.newService.reset();
        this.id = null;
        this.isLoading = false;
        this.dialogService.openToast({
          title: '',
          type: 'success',
          message: 'success',
        });
      },
      error: err => {
        this.isLoading = false;
        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: err?.object?.response_message ?? 'Failed',
        });
      },
    });
  }

  getSelectedDepartment(event: ItemModel | null) {
    if (event) {
      this.id = event.id;
    }
  }
  showAddNewService = false;
  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          this.showAddNewService = fragment === 'newService';
        },
      });
    }
  }
}
