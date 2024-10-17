import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { SavingDetailService } from '../../../core/services/saving/saving.service';
import {
  AdhesionBodyModel,
  AdhesionResponseModel,
  TontineDataModele,
} from '../saving.models';
import { Observable, Subject, takeUntil } from 'rxjs';

import { ActiveMainConfigModel } from '../../../core/services/config/main-config.models';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { DialogService } from '../../../core/services';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { AuthService } from '../../../core/services';
import { LookupModel } from '../../../global/models/global.models';

@Component({
  selector: 'app-club-adhesion',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, LookupComponent, CommonModule],
  templateUrl: './club-adhesion.component.html',
  styleUrl: './club-adhesion.component.scss',
})
export class ClubAdhesionComponent implements OnInit {
  mainConfig$!: Observable<ActiveMainConfigModel>;
  mainConfig!: ActiveMainConfigModel;
  tontineId!: number;
  adhesionForm: FormGroup;
  isChecked = false;
  savingData!: TontineDataModele;
  part!: number;
  contribution!: number;
  showInfo = false;
  errorMessage = '';
  referenceId!: number;
  userClientId!: number;
  dialogState$!: Observable<DialogResponseModel>;
  private onDestroy$ = new Subject<void>();
  lookupEffectue = false;
  pin!: string;
  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private savingDetailService: SavingDetailService,
    private dialogService: DialogService,
    private authService: AuthService
  ) {
    this.dialogState$ = this.dialogService.getDialogState();
    this.adhesionForm = new FormGroup({
      contribution: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      isRenewable: new FormControl<boolean>(
        this.isChecked,
        Validators.required
      ),
    });
  }

  ngOnInit(): void {
    this.authService
      .getUserClientId()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(clientId => {
        this.userClientId = clientId;
      });

    this.route.params.subscribe({
      next: (params: Params) => {
        // Assurez-vous que 'tontineId' est un nombre en utilisant l'opérateur '+'
        this.tontineId = params['tontineId'];
        if (this.tontineId) {
          this.getSavingData();
        }
      },
    });
    this.adhesionForm.get('contribution')?.valueChanges.subscribe(() => {
      this.calculateValue();
    });

    this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        if (dialogResponse.action === 'pin' && dialogResponse.response.pin) {
          this.pin = dialogResponse.response.pin;
          this.tontineAdhesion();
        }
      },
    });
  }

  getMemberId(event: LookupModel | null) {
    if (event) {
      this.referenceId = event.id;
      this.lookupEffectue = true;
    } else {
      this.referenceId = 0;
      this.lookupEffectue = false;
    }
  }
  getSavingData() {
    this.savingDetailService.getTontineDetails(this.tontineId).subscribe({
      next: (response: { object: TontineDataModele }) => {
        this.savingData = response.object;
      },
    });
  }

  calculateValue() {
    const contribution = parseFloat(
      this.adhesionForm.get('contribution')?.value || '0'
    );
    if (this.adhesionForm.get('contribution')?.valid) {
      if (contribution && contribution > 0) {
        const contributionValue = contribution * this.savingData.contribution;
        const partvalue = contribution * this.savingData.mise_perso;
        this.contribution = contributionValue;
        this.part = partvalue;
        this.showInfo = true;
      }
    } else {
      this.showInfo = false;
      this.contribution = 0;
    }
  }

  openPinPopup() {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Please enter your PIN code to continue.',
      action: 'pin',
    });
  }
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.cdr.detectChanges();
    this.adhesionForm.patchValue({
      isRenewable: this.isChecked,
    });
  }
  isFormValid(): boolean {
    return this.adhesionForm.valid && this.isChecked;
  }

  tontineAdhesion() {
    this.dialogService.dispatchLoading();
    // this.loading = true;
    const body: AdhesionBodyModel = {
      tontine: this.tontineId,
      membre_client: this.userClientId,

      reference_member: '1',
      parts: this.contribution,
    };
    this.savingDetailService
      .tontineAdhesion(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: AdhesionResponseModel) => {
          // this.loading = false;
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
}
