import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ConfigService,
  DialogService,
  MenuService,
} from '../../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CounterService } from '../../../../core/services/counter/counter.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageMenusModel } from '../../../admin/menu/menu.models';
import { OrganizationModel } from '../../../auth/auth.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { ItemModel } from '../../../../global/components/lookups/lookup/lookup.model';
import {
  AssignOperatorBodyModel,
  AssignOperatorModel,
  CounterDetailsModel,
  CounterTellerModel,
  CounterTreasurerModel,
  MainBoxModel,
} from '../operation.model';

@Component({
  selector: 'app-counter-details',
  standalone: true,
  imports: [
    LookupComponent,
    CommonModule,
    AmountVisibilityComponent,
    RouterLink,
  ],
  templateUrl: './counter-details.component.html',
  styleUrl: './counter-details.component.scss',
})
export class CounterDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  counterId!: number;

  counterDetails!: CounterDetailsModel;
  counterTellers!: CounterTellerModel[];
  counterTreasurers!: CounterTreasurerModel[];
  mainBox!: MainBoxModel;

  isLoading = false;
  tellerLoading = false;
  treasurerLoading = false;
  mainBoxLoading = false;
  assignationLoading = false;

  // selectedMenu = 'details';
  showDetails = true;

  selectedOperator!: ItemModel | null;
  // selectedAgence: any;
  selectedTreasurer!: ItemModel | null;
  pin!: string;

  isTeller!: boolean | null;
  organization$: Observable<OrganizationModel | null>;
  organizationId!: number;

  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  pageMenus: PageMenusModel[] = [];

  dialog!: DialogResponseModel;
  dialog$: Observable<DialogResponseModel>;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private counterService: CounterService,
    private dialogService: DialogService
  ) {
    this.theme$ = this.configService.getMode();
    this.organization$ = this.configService.getSelectedOrganization();
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          this.showDetails = fragment === null;
        },
      });
    }

    this.isTeller = false;
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: params => {
        this.counterId = params['id'];

        this.pageMenus = [
          {
            icon: 'circle-info',
            title: 'Details',
            url: `/w/workstation/d/desk/operations/counter/${this.counterId}`,
            icon_classes: 'fs-medium',
          },
          {
            icon: 'user-tag',
            title: 'Assignation',
            url: `/w/workstation/d/desk/operations/counter/${this.counterId}`,
            fragment: 'assignation',
            icon_classes: 'fs-medium',
          },
        ];
        this.menuService.setPageMenus(this.pageMenus);

        this.getCounterDetails();
        this.getCounterTellers();
        this.getCounterTreasurers();
        this.getMainBox();
      },
    });

    this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: organization => {
        if (organization) {
          this.organizationId = organization.id;
        }
      },
    });

    this.theme$.subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: dialog => {
        this.dialog = dialog;
        if (
          this.dialog &&
          this.dialog.response.pin &&
          this.dialog.action === 'GetPin'
        ) {
          this.pin = this.dialog.response.pin;
          this.assignOperator();
        }
      },
    });
  }

  getCounterDetails() {
    this.isLoading = true;
    this.counterService
      .getCounterDetails(this.counterId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data as { object: CounterDetailsModel };
          this.counterDetails = res.object;
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          return error;
        },
      });
  }

  assignOperator() {
    this.assignationLoading = true;
    this.dialogService.loading();
    let data: AssignOperatorBodyModel = {
      operator_code: this.selectedOperator?.username as string,
      counter_pk: this.counterDetails.id,
      pin_code: this.pin,
    };
    if (this.isTeller) {
      data = {
        ...data,
        treasurer: this.selectedTreasurer?.id as number,
      };
    }
    this.counterService
      .assignOperatorToCounter(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: res => {
          const response = res as { object: AssignOperatorModel };
          if (
            response.object['success'] !== undefined &&
            !response.object.success
          ) {
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              title: '',
              message: response.object.response_message,
              type: 'failed',
            });
            this.assignationLoading = false;
            return;
          }

          this.selectedOperator = null;
          this.selectedTreasurer = null;
          this.isTeller = false;
          this.showDetails = true;

          this.getCounterTellers();
          this.getCounterTreasurers();
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            message: 'Success',
            type: 'success',
          });
          this.assignationLoading = false;
        },
        error: error => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            message: 'Something went wrong, please retry again',
            type: 'failed',
          });
          this.assignationLoading = false;
          return error;
        },
      });
  }

  openPinPopup() {
    this.dialogService.openDialog({
      action: 'GetPin',
      message: '',
      title: '',
      type: 'pin',
    });
  }

  getCounterTellers() {
    this.tellerLoading = true;
    this.counterService
      .getCounterTeller(this.counterId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data as { objects: CounterTellerModel[] };
          this.counterTellers = res.objects;
          this.tellerLoading = false;
        },
        error: error => {
          this.tellerLoading = false;
          return error;
        },
      });
  }
  getCounterTreasurers() {
    this.treasurerLoading = true;
    this.counterService
      .getCounterTreasurer(this.counterId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data as {
            objects: CounterTreasurerModel[];
            count: number;
          };
          this.counterTreasurers = res.objects;
          this.treasurerLoading = false;
        },
        error: error => {
          this.treasurerLoading = false;
          return error;
        },
      });
  }

  getMainBox() {
    this.mainBoxLoading = true;
    this.counterService.getCounterMainBox(this.counterId).subscribe({
      next: response => {
        const res = response as { objects: MainBoxModel[] };
        this.mainBoxLoading = false;
        this.mainBox = res.objects[0];
      },
      error: error => {
        this.mainBoxLoading = false;
        return error;
      },
    });
  }

  selectMenu(name: string) {
    if (name === 'details') {
      this.showDetails = true;
    } else if (name === 'assignation') {
      this.showDetails = false;
    }
  }

  selectItem(data: ItemModel | null, itemName: string) {
    if (itemName === 'operator') {
      this.selectedOperator = data;
      this.isTeller = data?.is_teller ?? null;
    } else if (itemName === 'treasurer') {
      this.selectedTreasurer = data;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.menuService.destroyPageMenus();
  }
}
