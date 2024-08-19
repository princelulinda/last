import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
})
export class AgentComponent {}
