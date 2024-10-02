import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './agent-list.component.html',
  styleUrl: './agent-list.component.scss',
})
export class AgentListComponent {
  //   ngOnInit(): void {
  //     //
  //   }
  headers = [
    {
      name: 'Name',
      field: ['agent_name'],
      size: '',
      detail: {
        link: '/w/workstation/a/admin/agent/details/',
        field: 'id',
      },
    },
    { name: 'Agent Code', field: ['agent_code'], size: '' },

    { name: 'Type', field: ['agent_type'], size: '' },
    {
      name: 'Balance',
      field: ['agent_balance'],
      format: 'currency',
      size: '',
    },

    {
      name: 'Referencer',
      field: ['client_creation.client_full_name'],
      size: '',
    },
    {
      name: 'Referencer Code',
      field: ['client_creation.client_code'],
      size: '',
    },

    {
      name: 'Active',
      field: ['is_active'],
      boolean: true,
      size: '',
    },
  ];
}
