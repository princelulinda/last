import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../../core/services/admin/admin.service';
import {
  AddCounterBodyModel,
  AddCounterResponseModel,
  BranchDetailsModele,
} from '../agence.models';
import { ActivatedRoute } from '@angular/router';
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
@Component({
  selector: 'app-admin-branch-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
  private onDestroy$: Subject<void> = new Subject<void>();
  private pageMenus: PageMenusModel[] = [];
  constructor(
    private adminService: AdminService,
    private location: Location,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private dialogService: DialogService
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
          this.showDetails = fragment === 'addBranch';
        },
      });
    }

    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.branchId = params['branchId'];
        this.pageMenus = [
          {
            icon: 'circle-info',
            title: 'Branch Details',
            url: `/w/workstation/a/admin/branch/${this.branchId}`,
          },
          {
            icon: 'fa-solid fa-plus',
            title: 'Add Branch',
            url: `/w/workstation/a/admin/branch/${this.branchId}`,
            fragment: 'addBranch',
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

  addNewCounter() {
    this.dialogService.dispatchLoading();
    this.isLoading = true;

    const body: AddCounterBodyModel = {
      ...this.NewcounterForm.value,
      branch: this.branchId,
      location: 'POINT(-3.3820805710101207 29.356958995720028)',
    };

    this.adminService
      .addCounter(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: AddCounterResponseModel) => {
          this.isLoading = false;
          this.dialogService.closeLoading();
          if (response.object.success) {
            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: response.object.response_message,
            });
          } else {
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: response.object.response_message,
            });
          }
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: 'failed',
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
