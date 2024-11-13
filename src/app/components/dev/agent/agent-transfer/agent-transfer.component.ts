import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-transfer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-transfer.component.html',
  styleUrl: './agent-transfer.component.scss',
})
export class AgentTransferComponent {
  selectedState: 'bank' | 'debit' | 'agent code' | 'amount' = 'bank';
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
