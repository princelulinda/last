import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../../core/services/admin/admin.service';
import { CreateNewServiceBodyModel, CreateNewServiceModel } from '../rh.model';

@Component({
  selector: 'app-admin-services-list',
  standalone: true,
  imports: [ListComponent, ReactiveFormsModule],
  templateUrl: './admin-services-list.component.html',
  styleUrl: './admin-services-list.component.scss',
})
export class AdminServicesListComponent {
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
  constructor(private adminService: AdminService) {}
  newService = new FormGroup({
    serviceName: new FormControl('', Validators.required),
    departments: new FormControl('', Validators.required),
  });

  newServiceData!: CreateNewServiceModel;
  createNewService() {
    const body: CreateNewServiceBodyModel = {
      name: this.newService.value.serviceName,
      department: this.newService.value.departments,
      disallow_connexion: false,
    };
    this.adminService.createNewService(body).subscribe({
      next: data => {
        this.newService.reset();
        this.newServiceData = data.object;
      },
      error() {
        //
      },
    });
  }
}
