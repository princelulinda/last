import { Component, OnInit } from '@angular/core';
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
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-direction-list',
  standalone: true,
  imports: [ListComponent, ReactiveFormsModule],
  templateUrl: './admin-direction-list.component.html',
  styleUrl: './admin-direction-list.component.scss',
})
export class AdminDirectionListComponent implements OnInit {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/direction/',
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

  isLoading = false;
  constructor(
    private adminService: AdminService,
    private dialogService: DialogService,
    private route: ActivatedRoute
  ) {}
  newDirection = new FormGroup({
    directionName: new FormControl('', Validators.required),
    directionType: new FormControl('', Validators.required),
  });

  directionsData!: CreateNewDirectionModel;
  createNewDirection() {
    this.isLoading = true;
    const body: CreateNewDirectionBodyModel = {
      name: this.newDirection.value.directionName,
      direction_type: this.newDirection.value.directionType,
    };
    this.adminService.createNewDirection(body).subscribe({
      next: data => {
        this.directionsData = data.object;
        this.newDirection.reset();
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
  showAddNewDirection = false;
  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          this.showAddNewDirection = fragment === 'newDirection';
        },
      });
    }
  }
}
