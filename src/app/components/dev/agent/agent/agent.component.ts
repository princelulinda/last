import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { AgentModel } from '../agent.models';
import { DialogService } from '../../../../core/services';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';
@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    AmountVisibilityComponent,
    ProfileCardComponent,
  ],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
})
export class AgentComponent implements OnInit, OnDestroy {
  private OnDestroy$: Subject<void> = new Subject<void>();
  data!: AgentModel;
  isLoading = true;

  constructor(
    private agentService: AgentService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getDatAgent();
  }

  getDatAgent(): void {
    this.isLoading = true;
    this.agentService
      .getAgentInfos()
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: response => {
          this.data = response.object.response_data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'failed to get agent informations',
          });
        },
      });
  }

  ngOnDestroy() {
    this.OnDestroy$.next();
    this.OnDestroy$.complete();
  }
}
