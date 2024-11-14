import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BankService } from '../../../../core/services';
import { Subject, takeUntil } from 'rxjs';
import { AgentBanksModel } from '../agent.models';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-agent-transfer',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './agent-transfer.component.html',
  styleUrl: './agent-transfer.component.scss',
})
export class AgentTransferComponent implements OnInit {
  private OnDestroy$: Subject<void> = new Subject<void>();

  selectedState: 'bank' | 'debit' | 'agent code' | 'amount' = 'bank';
  banks!: AgentBanksModel[];

  constructor(private bankService: BankService) {}

  ngOnInit() {
    this.getAgentBanks();
  }

  getAgentBanks() {
    this.bankService
      .getAgentBanks()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: (data: { objects: AgentBanksModel[] }) => {
          this.banks = data.objects;
        },
      });
  }
  validateInput(event: KeyboardEvent) {
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
    ];
    if (!allowedKeys.includes(event.key) && !event.key.match(/^[0-9]$/)) {
      event.preventDefault();
    }
  }
}
