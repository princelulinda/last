import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-admin-branch-list',
  standalone: true,
  imports: [ListComponent, ReactiveFormsModule],
  templateUrl: './admin-branch-list.component.html',
  styleUrl: './admin-branch-list.component.scss',
})
export class AdminBranchListComponent {
  counterForm!: FormGroup;
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/admin/branch/',
        field: 'id',
      },
    },
    {
      name: 'Branche Code',
      field: ['formatted_code'],
      size: '',
    },
    {
      name: 'Organization',
      field: ['organization_tenant.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Active',
      field: ['organization_tenant.is_active'],
      size: '',
      boolean: true,
    },
  ];
  selectedList: 'operators' | 'invitations' | 'newOperator' = 'operators';
  constructor() {
    this.counterForm = new FormGroup({
      name: new FormControl('', Validators.required),
      city: new FormControl(''),
    });
  }
}
