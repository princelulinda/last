import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { DatePipe, NgClass } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { StatementComponent } from '../../../statements/statement/statement.component';
import { AgentModel } from '../../agent.model';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [
    DatePipe,
    AmountVisibilityComponent,
    NgClass,
    StatementComponent,
    RouterLink,
    SkeletonComponent,
    ProfileCardComponent,
  ],
  templateUrl: './agent-detail.component.html',
  styleUrl: './agent-detail.component.scss',
})
export class AgentDetailComponent implements OnInit {
  agentId = '';
  private onDestroy$: Subject<void> = new Subject<void>();
  agentDetails!: AgentModel;
  selectedMenu = '';
  isLoading = true;
  agentsLoading = true;
  showAmounts = false;

  crumbs = [
    {
      label: 'Agents',
      link: '/w/workstation/desk/agent',
    },
    {
      label: 'Details',
      active: true,
    },
  ];
  constructor(
    private agentService: AgentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        this.agentId = data['id'];
        this.getAgentsDetails();
      },
    });
  }

  //agent details
  getAgentsDetails() {
    this.isLoading = true;
    this.agentService
      .getAgentsDetails(this.agentId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.agentDetails = response.object;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }
  refreshPage() {
    this.isLoading = true;
    this.getAgentsDetails();
  }
}
