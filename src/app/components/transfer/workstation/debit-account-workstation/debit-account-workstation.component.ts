import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { ConfigService } from '../../../../core/services';
import { ActiveMainConfigModel } from '../../../../core/services/config/main-config.models';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { LookupIndividualComponent } from '../../../dev/lookup-individual/lookup-individual.component';

import { ClientInfoModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { LookupModel } from '../../../../global/models/global.models';

@Component({
  selector: 'app-debit-account-workstation',
  standalone: true,
  imports: [CommonModule, LookupComponent, LookupIndividualComponent],
  templateUrl: './debit-account-workstation.component.html',
  styleUrl: './debit-account-workstation.component.scss',
})
export class DebitAccountWorkstationComponent implements OnInit {
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<ActiveMainConfigModel>;
  mainConfig!: ActiveMainConfigModel;
  @Input() selectedDebitAccountType = '';

  lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';
  @Output() lookupOptions = new EventEmitter<LookupModel | null>();
  @Output() selectedDebitAccountTypeChange = new EventEmitter<string>();
  debitAccount!: LookupModel | null;
  individualClientInfo: ClientInfoModel | null = null;

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }
  selectDebitAccountType(accountType: string) {
    this.selectedDebitAccountType = accountType;
    this.selectedDebitAccountTypeChange.emit(this.selectedDebitAccountType); // Émet la valeur de selectedDebitAccountType
    if (accountType !== this.selectedDebitAccountType) {
      this.selectedDebitAccountType = '';
    }
    switch (accountType) {
      case 'account':
        this.debitAccount = null;
        break;

      case 'wallet':
        this.lookupDebitAccountUrl = '/dbs/wallets/object_lookup?lookup_data=';
        this.debitAccount = null;
        break;

      case 'agent':
        this.lookupDebitAccountUrl = '/dbs/agents/object_lookup?lookup_data=';
        this.debitAccount = null;
        break;

      case 'merchant':
        this.lookupDebitAccountUrl =
          '/dbs/merchant/manage/object_lookup?lookup_data=';
        this.debitAccount = null;
        break;

      default:
        break;
    }
  }
  getIndividualClient(event: ClientInfoModel) {
    this.individualClientInfo = event;
  }

  getClient(client: LookupModel | null) {
    this.debitAccount = client;

    //console.log('helllooo' , this.debitAccount)
    this.lookupOptions.emit(this.debitAccount);
  }
}
