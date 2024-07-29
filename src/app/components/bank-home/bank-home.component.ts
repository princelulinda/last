import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwitchBankComponent } from '../../global/components/popups/switch-bank/switch-bank.component';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../global/components/loaders/skeleton/skeleton.component';
import { bankModel } from '../../core/db/models/bank/bank.model';
import { BankOptions } from '../dashboards/dashboard.model';
import { ConfigService } from '../../core/services';
import { ModeModel } from '../../core/services/config/main-config.models';
import { Observable, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-bank-home',
  standalone: true,
  imports: [RouterOutlet, SwitchBankComponent, RouterLink, SkeletonComponent],
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.scss',
})
export class BankHomeComponent implements OnInit, OnDestroy {
  bankMenus = [
    {
      name: 'Accounts',
      icon: 'user-circle',
      image: '',
      link: '/b/banking/accounts',
    },
    {
      name: 'Savings',
      icon: 'piggy-bank',
      image: '',
      link: '/b/banking/saving',
    },
    {
      name: 'Loans',
      icon: '',
      image: ['loan-black.svg', 'loan-white.svg'],
      link: '/b/banking/loan',
    },
    {
      name: 'Withdrawals',
      icon: '',
      image: ['withdrawal-black.svg', 'withdrawal-white.svg'],
      link: '',
    },
    {
      name: 'Transfer',
      icon: 'paper-plane',
      image: '',
      link: '',
    },
  ];
  @Output() backToPreviousState = new EventEmitter<void>();
  selectedBank!: bankModel;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private configService: ConfigService) {
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
      error: err => {
        console.error('Error fetching theme:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleBankOptions(options: BankOptions) {
    // console.log('Options de banque reçues :', options);
    if (options.banks && options.banks.length > 0) {
      this.selectedBank = options.banks[0]; // Sélectionne la première banque comme exemple
      //console.log('Banque sélectionnée :', this.selectedBank);
    }
  }

  goBack() {
    this.backToPreviousState.emit();
  }
}
