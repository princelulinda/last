import { Component, OnInit } from '@angular/core';
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
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { AutocompleteModel } from '../../../../global/models/global.models';

@Component({
  selector: 'app-admin-departements-list',
  standalone: true,
  imports: [ListComponent, LookupComponent, ReactiveFormsModule],
  templateUrl: './admin-departements-list.component.html',
  styleUrl: './admin-departements-list.component.scss',
})
export class AdminDepartementsListComponent implements OnInit {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/a/admin/department/',
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

  isLoading = false;
  id!: number | null;
  constructor(
    private adminService: AdminService,
    private dialogService: DialogService,
    private route: ActivatedRoute
  ) {}
  newDepartment = new FormGroup({
    departmentName: new FormControl('', Validators.required),
  });
  departmentData!: AdminCreateNewDepartmentModel;
  createNewDepartment() {
    this.isLoading = true;
    const body: AdminCreateNewDepartmentBodyModel = {
      name: this.newDepartment.value.departmentName,
      direction: this.id,
    };
    this.adminService.createNewDepartement(body).subscribe({
      next: data => {
        this.departmentData = data.object;
        this.isLoading = false;
        // this.newDep=data.object;
        this.newDepartment.reset();
        this.id = null;
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

  getSelectedDepartment(event: AutocompleteModel | null) {
    if (event) {
      this.id = event.id;
    }
  }
  showAddNewDepartment = false;
  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          this.showAddNewDepartment = fragment === 'newDepartment';
        },
      });
    }
  }
}
