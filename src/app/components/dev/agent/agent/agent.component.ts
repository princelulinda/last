import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { AgentService } from '../../../../agent.service';
import { AgentModel, AgentResModel } from '../agent.models';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
})
export class AgentComponent implements OnInit { 

  data!: AgentModel;

  constructor(private agentService : AgentService) { }

  ngOnInit(): void {
    this.getDatAgent(); 
  }

  getDatAgent(): void {
    this.agentService.getAgentInfos().subscribe({
      next: (response: {object: AgentResModel}) => {
        this.data = response.object.response_data
        console.log("donnees trouvees agent :", this.data);
      },
      error: error => {
        console.error("Erreur:", error);
      }
    });
  }
  
}

