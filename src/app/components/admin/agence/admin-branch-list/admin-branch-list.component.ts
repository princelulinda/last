import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import { DialogService } from '../../../../core/services';
import { ListComponent } from '../../../../global/components/list/list/list.component';

import { AdminService } from '../../../../core/services/admin/admin.service';
import { MenuService } from '../../../../core/services';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { OrganizationModel } from '../../../auth/auth.model';
import { ConfigService } from '../../../../core/services';
import { AutocompleteModel } from '../../../../global/models/global.models';

@Component({
  selector: 'app-admin-branch-list',
  standalone: true,
  imports: [ListComponent, ReactiveFormsModule, CommonModule, LookupComponent],
  templateUrl: './admin-branch-list.component.html',
  styleUrl: './admin-branch-list.component.scss',
})
export class AdminBranchListComponent implements OnInit, OnDestroy {
  newBranchForm!: FormGroup;
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/a/admin/branch/',
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

  pagesMenus = [
    {
      icon: 'list-ul',
      title: 'Branchs List',
      url: '/w/workstation/a/admin/branch',
    },
    {
      icon: 'fa-solid fa-plus',
      title: 'newBranch',
      url: '/w/workstation/a/admin/branch',
      fragment: 'newBranch',
    },
  ];

  selectedList: 'branchLIst' | 'newBranch' = 'branchLIst';
  isLoading = false;
  organization$: Observable<OrganizationModel | null>;
  organizationId!: number;
  private onDestroy$: Subject<void> = new Subject<void>();

  selectedOperatorId: number | null = null;
  constructor(
    private dialogService: DialogService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private configService: ConfigService,
    private location: Location
  ) {
    this.organization$ = this.configService.getSelectedOrganization();
    this.newBranchForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          switch (fragment) {
            case 'newBranch':
              this.selectedList = 'newBranch';
              break;

            case null:
            default:
              this.selectedList = 'branchLIst';
              break;
          }
        },
      });
    }
    this.menuService.setPageMenus(this.pagesMenus);

    this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: organization => {
        if (organization) this.organizationId = organization.id;
      },
    });
  }

  selectOperator($event: AutocompleteModel | null) {
    this.selectedOperatorId = $event ? $event.id : null;
  }

  addNewBranch() {
    if (this.selectedOperatorId) {
      this.dialogService.dispatchLoading();

      this.isLoading = true;
      this.isLoading = true;
      const name = this.newBranchForm.get('name')?.value;

      const hr_chief = this.selectedOperatorId;

      this.adminService.addNewBranch(name, hr_chief).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogService.closeLoading();

          this.dialogService.openToast({
            type: 'success',
            title: 'Succès',
            message: 'success',
          });
          this.router.navigate(['/w/workstation/a/admin/branch']);
          this.newBranchForm.reset();
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: 'failed please try again',
          });
        },
      });
    }
  }
  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.menuService.destroyPageMenus();
  }
}
