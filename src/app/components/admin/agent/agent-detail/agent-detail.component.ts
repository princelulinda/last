import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { DatePipe, NgClass } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { StatementComponent } from '../../../statements/statement/statement.component';
import { AgentModel } from '../agent.model';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [
    DatePipe,
    AmountVisibilityComponent,
    NgClass,
    StatementComponent,
    RouterLink,
  ],
  templateUrl: './agent-detail.component.html',
  styleUrl: './agent-detail.component.scss',
})
export class AgentDetailComponent implements OnInit {
  agentId = '';
  private onDestroy$: Subject<void> = new Subject<void>();
  agentDetails!: AgentModel;
  // agentDetails:any;
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
    //   this.agentDetails = null;
    this.agentService
      .getAgentsDetails(this.agentId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.agentDetails = response.object;
          this.isLoading = false;
          // this.getClientDetails(this.agentDetails.client_id);
          // if (this.agentDetails.is_superagent) {
          //     this.getAgentsBySuperAgent(this.agentDetails.id);
          // }
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
