import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../agent.service';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-merchant-list',
  standalone: true,
  imports: [CommonModule,SkeletonComponent],
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.scss'
})
export class MerchantListComponent implements OnInit {
  
  data: Array<any> = [];
  Loading : boolean = true;

  constructor(private merchantService: AgentService) { }

  ngOnInit(): void {
    this.getDataMerchant(); 
  }

  getDataMerchant(): void {
    this.merchantService.getMerchantInfos().subscribe({
      next: response => {
        this.data = response.objects;
        console.log("donnees trouvees merchant :", this.data);
        this.Loading = false;
      },
      error: error => {
        console.error("Erreur merchant:", error);
      }
    });
  }
}
