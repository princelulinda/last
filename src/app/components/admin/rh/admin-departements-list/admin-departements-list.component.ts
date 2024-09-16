import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../../core/services/admin/admin.service';
import {
  AdminCreateNewDepartmentBodyModel,
  AdminCreateNewDepartmentModel,
} from '../rh.model';

@Component({
  selector: 'app-admin-departements-list',
  standalone: true,
  imports: [ListComponent, LookupComponent, ReactiveFormsModule],
  templateUrl: './admin-departements-list.component.html',
  styleUrl: './admin-departements-list.component.scss',
})
export class AdminDepartementsListComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/desk/department/',
        field: 'id',
      },
    },
    {
      name: 'Direction Name',
      field: ['direction.name'],
      size: '',
    },
    {
      name: 'Direction Type',
      field: ['direction.direction_type.title'],
      size: '',
      icon: 'direction.direction_type.icon',
      css: 'direction.direction_type.css',
    },
  ];

  constructor(private adminService: AdminService) {}
  newDepartment = new FormGroup({
    departmentName: new FormControl('', Validators.required),
    direction: new FormControl('', Validators.required),
  });
  departmentData!: AdminCreateNewDepartmentModel;
  createNewDepartment() {
    const body: AdminCreateNewDepartmentBodyModel = {
      name: this.newDepartment.value.departmentName,
      direction: this.newDepartment.value.direction,
    };
    this.adminService.createNewDepartement(body).subscribe({
      next: data => {
        this.departmentData = data.object;
        // this.newDep=data.object;
        this.newDepartment.reset();
      },
      error() {
        //
      },
    });
  }
}
