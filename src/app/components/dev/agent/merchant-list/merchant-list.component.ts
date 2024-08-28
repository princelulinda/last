import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../agent.service';

@Component({
  selector: 'app-merchant-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.scss'
})
export class MerchantListComponent implements OnInit {
  data: Array<any> = [];

  constructor(private merchantService: AgentService) { }

  ngOnInit(): void {
    this.getDataMerchant(); 
  }

  getDataMerchant(): void {
    this.merchantService.getMerchantInfos().subscribe({
      next: response => {
        this.data = response.objects;
        console.log("donnees trouvees merchant :", this.data);
      },
      error: error => {
        console.error("Erreur merchant:", error);
      }
    });
  }
}
