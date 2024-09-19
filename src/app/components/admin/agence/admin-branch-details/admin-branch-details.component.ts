import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import {
  AddBranchCounterBodyModel,
  BranchDetailsModele,
} from '../agence.models';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageMenusModel } from '../../menu/menu.models';
import { MenuService } from '../../../../core/services';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../../../core/services';
import { ListComponent } from '../../../../global/components/list/list/list.component';
@Component({
  selector: 'app-admin-branch-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ListComponent],
  templateUrl: './admin-branch-details.component.html',
  styleUrl: './admin-branch-details.component.scss',
})
export class AdminBranchDetailsComponent implements OnInit, OnDestroy {
  loadingData = false;
  branchId!: number;
  branchDetails!: BranchDetailsModele | null;
  showDetails = false;
  NewcounterForm!: FormGroup;
  isLoading = false;
  branchCountersUrl = '';
  selectedMenu: 'detail' | 'branchCounter' | 'newBranchCounter' = 'detail';
  private onDestroy$: Subject<void> = new Subject<void>();
  private pageMenus: PageMenusModel[] = [];

  counterHeaders = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/a/admin/counter/',
        field: 'id',
      },
    },
    {
      name: 'Counter Code',
      field: ['formatted_code'],
      size: '',
    },
    {
      name: 'Agence',
      field: ['branch.name'],
      size: '',
    },
  ];
  constructor(
    private adminService: AdminService,
    private location: Location,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.NewcounterForm = new FormGroup({
      name: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          switch (fragment) {
            case 'branchCounter':
              this.selectedMenu = 'branchCounter';
              break;

            case 'newBranchCounter':
              this.selectedMenu = 'newBranchCounter';
              break;

            case null:
            default:
              this.selectedMenu = 'detail';
              break;
          }
        },
      });
    }

    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.branchId = params['branchId'];
        this.branchCountersUrl = `/hr/counter/?branch=${this.branchId}&`;
        this.pageMenus = [
          {
            icon: 'circle-info',
            title: 'Branch Details',
            url: `/w/workstation/a/admin/branch/${this.branchId}`,
          },
          {
            icon: 'fa-solid fa-house-circle-check',
            title: 'Branch Counter',
            url: `/w/workstation/a/admin/branch/${this.branchId}`,
            fragment: 'branchCounter',
          },
          {
            icon: 'fa-solid fa-plus',
            title: 'New BranchCounter',
            url: `/w/workstation/a/admin/branch/${this.branchId}`,
            fragment: 'newBranchCounter',
          },

          {
            icon: 'fa-solid fa-list-ul',
            title: 'Branch List',
            url: `/w/workstation/a/admin/branch/`,
          },
        ];
        this.menuService.setPageMenus(this.pageMenus);
      },
    });

    this.getBranchDetails();
  }
  goBack(): void {
    this.location.back();
  }
  refresh() {
    this.getBranchDetails();
    this.branchDetails = null;
  }
  getBranchDetails() {
    this.loadingData = true;
    this.adminService.getBranchDetails(2).subscribe({
      next: (response: { object: BranchDetailsModele }) => {
        this.loadingData = false;
        this.branchDetails = response.object;
      },
    });
  }

  addBranchCounter() {
    this.dialogService.dispatchLoading();
    this.isLoading = true;

    const body: AddBranchCounterBodyModel = {
      ...this.NewcounterForm.value,
      branch: this.branchId,
      location: 'POINT(-3.3820805710101207 29.356958995720028)',
    };

    this.adminService
      .addBranchCounter(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogService.closeLoading();

          this.dialogService.openToast({
            type: 'success',
            title: 'Succès',
            message: 'Counter added successfully!',
          });
          this.router.navigate(
            ['/w/workstation/a/admin/branch', this.branchId],
            {
              fragment: 'branchCounter',
            }
          );

          this.NewcounterForm.reset();
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: 'Failed to add the counter',
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.menuService.destroyPageMenus();
  }
}
