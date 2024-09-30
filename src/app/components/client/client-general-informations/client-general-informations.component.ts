import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { FileComponent } from '../../../global/components/file/file.component';
import {
  ClientCorporateModel,
  ClientWorkstationModel,
  IndividualClientModel,
  ResponseDataForClientModel,
  ResponseDataForCorporateModel,
} from '../client.model';
import { ModeModel } from '../../../core/services/config/main-config.models';
import {
  ClientService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { FileResponseModel } from '../../../global/components/file/file.model';

@Component({
  selector: 'app-client-general-informations',
  standalone: true,
  imports: [NgClass, CommonModule, ReactiveFormsModule, FileComponent],
  templateUrl: './client-general-informations.component.html',
  styleUrl: './client-general-informations.component.scss',
})
export class ClientGeneralInformationsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input() selectedClient!: ClientWorkstationModel;
  @Input() clientId!: string | number;
  @Input() clientIndiv!: IndividualClientModel | null;
  @Input() clientEntreprise!: ClientCorporateModel | null;
  @Input() selectedGeneralInfo = false;
  @Input() isGeneralInfoFormShown = false;
  @Output() refreshUpdates = new EventEmitter<string>();

  isLoading = false;

  individualClientInfo!: FormGroup;
  corporateClientInfo!: FormGroup;
  signature1!: string;
  signature2!: string;
  nationality!: string;
  placeOfBirth!: string;
  addSignature1 = false;
  addSignature2 = false;

  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  constructor(
    // private store: Store,
    private clientService: ClientService,
    // private Store: Store
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
    this.theme$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    if (this.clientIndiv) {
      this.individualClientInfo = new FormGroup({
        username: new FormControl(this.clientIndiv.username),
        firstname: new FormControl(this.clientIndiv.firstname),
        lastname: new FormControl(this.clientIndiv.lastname),
        email: new FormControl(this.clientIndiv.email),
        card_id: new FormControl(this.clientIndiv.card_id.reference_number),
        telephones: new FormControl(this.clientIndiv.telephones),
        profession: new FormControl(this.clientIndiv.other_profession),
        spouseName: new FormControl(this.clientIndiv.spouse_name),
        spouseTel: new FormControl(this.clientIndiv.spouse_telephone),
        fatherName: new FormControl(this.clientIndiv.father_name),
        motherName: new FormControl(this.clientIndiv.mother_name),
        dateOfBirth: new FormControl(this.clientIndiv.birthday),
        maritalStatus: new FormControl(this.clientIndiv.marital_status),
        matrimonialStatus: new FormControl(this.clientIndiv.matrimonial_status),
        placeOfBirth: new FormControl(this.clientIndiv.birth_place),
        refereeName: new FormControl(this.clientIndiv.referee_person),
      });
      if (this.clientIndiv.nationality !== null) {
        this.nationality = this.clientIndiv.nationality.name;
      }
      if (this.clientIndiv.birth_place !== null) {
        this.placeOfBirth = this.clientIndiv.birth_place.name;
      }
    }
    if (this.clientEntreprise) {
      this.corporateClientInfo = new FormGroup({
        name: new FormControl(this.clientEntreprise.corp_name),
        initials: new FormControl(this.clientEntreprise.corp_abrv_name),
        groupName: new FormControl(this.clientEntreprise.corp_group_name),
        isSuspect: new FormControl(this.clientEntreprise.is_suspect),
        riskDegree: new FormControl(
          this.clientEntreprise.corp_risk_degree.title
        ),
        suspectedCountry: new FormControl(
          this.clientEntreprise.in_suspected_country
        ),
        nonCooperativeCountry: new FormControl(
          this.clientEntreprise.live_in_non_cooperative_country
        ),
        notOnBlacklist: new FormControl(
          this.clientEntreprise.not_on_black_list
        ),
      });
    }
  }
  updateIndividualClientDetails() {
    this.isLoading = true;
    console.log(
      'updateIndividualClientDetails',
      this.individualClientInfo.value
    );

    const data = {
      father_name: this.individualClientInfo.value.fatherName,
      email: this.individualClientInfo.value.email,
      telephones: this.individualClientInfo.value.telephones,
      mother_name: this.individualClientInfo.value.motherName,
      marital_status: this.individualClientInfo.value.maritalStatus,
      other_profession: this.individualClientInfo.value.otherProfession,
      firstname: this.individualClientInfo.value.firstname,
      lastname: this.individualClientInfo.value.lastname,
      matrimonial_status: this.individualClientInfo.value.matrimonialStatus,
      referee_person: this.individualClientInfo.value.refereeName,
      spouse_name: this.individualClientInfo.value.spouseName,
      spouse_tel: this.individualClientInfo.value.spouseTel,
      birthday: this.individualClientInfo.value.dateOfBirth,
      write_signature: this.signature1,
      write_signature2: this.signature2,
    };

    this.clientService
      .UpdateIndividualClientDetails(this.clientId as string, data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const res = response as { object: ResponseDataForClientModel };
          if (response || res.object.success === true) {
            this.isLoading = false;
            this.isGeneralInfoFormShown = false;
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: 'Success',
            });
            this.refreshUpdates.emit('updated');
            this.addSignature1 = false;
            this.addSignature2 = false;
          } else if (res.object.success === false) {
            this.isLoading = false;
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: res.object.response_message,
            });
          }
        },
        error: msg => {
          console.log('Error Getting Location: ', msg);
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
          });
        },
      });
  }

  updateCorporateDetails() {
    this.isLoading = true;

    const data = {
      corp_name: this.corporateClientInfo.value.name,
      corp_abrv_name: this.corporateClientInfo.value.initials,
      corp_group_name: this.corporateClientInfo.value.groupName,
      is_suspect: this.corporateClientInfo.value.isSuspect,
      corp_risk_degree: this.corporateClientInfo.value.riskDegree,
      in_suspected_country: this.corporateClientInfo.value.suspectedCountry,
      live_in_non_cooperative_country:
        this.corporateClientInfo.value.nonCooperativeCountry,
      not_on_blacklist: this.corporateClientInfo.value.not_on_blacklist,
    };

    this.clientService
      .UpdateCorporateDetails(this.clientId as string, data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const res = response as { object: ResponseDataForCorporateModel };
          if (response || res.object.success === true) {
            this.isLoading = false;
            this.isGeneralInfoFormShown = false;

            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: 'Success',
            });
            this.refreshUpdates.emit('updated');
          } else if (res.object.success === false) {
            this.isLoading = false;
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: res.object.response_message,
            });
          }
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
          });
        },
      });
  }
  collectSignature1(signature1: FileResponseModel[]) {
    this.signature1 = signature1[0]?.object.uuid;
  }
  collectSignature2(signature2: FileResponseModel[]) {
    this.signature2 = signature2[0]?.object.uuid;
  }
  modifyOrAddSignature() {
    this.addSignature1 = true;
  }
  modifyOrAddSignature2() {
    this.addSignature2 = true;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
