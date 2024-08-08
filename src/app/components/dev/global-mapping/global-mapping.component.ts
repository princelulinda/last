import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AuthService, ConfigService } from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MobileBanksModel } from './glob-mapping.model';
import { GeneralService } from '../../../core/services';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { DebitAccountComponent } from '../../transfer/debit-account/debit-account.component';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { CommonModule } from '@angular/common';
import { DebitOptions } from '../../transfer/transfer.model';
import { accountsList } from '../../account/models';

@Component({
  selector: 'app-global-mapping',
  standalone: true,
  imports: [SkeletonComponent, DebitAccountComponent, CommonModule],
  templateUrl: './global-mapping.component.html',
  styleUrl: './global-mapping.component.scss',
})
export class GlobalMappingComponent implements OnInit, OnDestroy {
  userInfo!: UserInfoModel;
  userInfo$: Observable<UserInfoModel>;
  @Input() contact!: string;
  mobileBanks: MobileBanksModel[] | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;
  activePlatform: string | null = null;
  banksLoading = true;
  clientName!: string;
  selectedOperator: MobileBanksModel | null = null;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  private onDestroy$ = new Subject<void>();
  debitOptions: DebitOptions | null = null;
  showOpertors = false;
  showPinForm = false;
  selectedDebitType = '';
  debitId = '';
  debitHolder = '';
  accountSelected: accountsList | null = null;

  constructor(
    private authService: AuthService,
    private generalService: GeneralService,

    private configService: ConfigService
  ) {
    this.userInfo$ = this.authService.getUserInfo();
    this.theme$ = this.configService.getMode();
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit() {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
        //console.log('themmeee',this.theme)
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });

    this.userInfo$.subscribe({
      next: user => {
        this.userInfo = user;
        this.clientName = user.client.client_full_name;
        console.log('user', this.clientName);
      },
    });

    this.getMobileBanks();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getDebitOptions(event: string | DebitOptions) {
    if (typeof event === 'string') {
      this.selectedDebitType = event;
      console.log('ngiyoooo', this.selectedDebitType);
    } else {
      this.selectedDebitType = event.selectedDebitOption;
      console.log('ngiyoooo', this.selectedDebitType);
    }
  }

  getSelectedAccount(event: accountsList) {
    if (this.selectedDebitType === 'account') {
      const accountEvent = event as accountsList;
      this.debitId = accountEvent.id;
      console.log('ngiyooooIDDDDDDDD', this.debitId);
      this.debitHolder = accountEvent.acc_holder;
    }

    this.accountSelected = event as accountsList | null;
  }

  getMobileBanks() {
    this.banksLoading = true;
    this.generalService.getMobileBanks().subscribe({
      next: response => {
        this.mobileBanks = response.objects;
        this.banksLoading = false;
      },
      error: err => {
        console.error('Erreur lors de la récupération des bank mobile:', err);
        this.banksLoading = false;
      },
    });
  }
  getSelectedOperator(operator: MobileBanksModel) {
    this.selectedOperator = operator;
    //console.log('operatorrrrrrr',this.selectedOperator)
  }
}
