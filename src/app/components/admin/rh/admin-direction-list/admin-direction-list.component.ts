import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../../core/services/admin/admin.service';
import {
  CreateNewDirectionBodyModel,
  CreateNewDirectionModel,
} from '../rh.model';

@Component({
  selector: 'app-admin-direction-list',
  standalone: true,
  imports: [ListComponent, ReactiveFormsModule],
  templateUrl: './admin-direction-list.component.html',
  styleUrl: './admin-direction-list.component.scss',
})
export class AdminDirectionListComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/desk/direction/',
        field: 'id',
      },
    },
    {
      name: 'Direction Type',
      field: ['direction_type.title'],
      size: '',
      icon: 'direction_type.icon',
      css: 'direction_type.css',
    },
  ];

  constructor(private adminService: AdminService) {}
  newDirection = new FormGroup({
    directionName: new FormControl('', Validators.required),
    directionType: new FormControl('', Validators.required),
  });

  directionsData!: CreateNewDirectionModel;
  createNewDirection() {
    const body: CreateNewDirectionBodyModel = {
      name: this.newDirection.value.directionName,
      direction_type: this.newDirection.value.directionType,
    };
    this.adminService.createNewDirection(body).subscribe({
      next: data => {
        this.directionsData = data.object;
        this.newDirection.reset();
      },
      error() {
        //
      },
    });
  }
}
