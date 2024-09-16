import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { MerchantModel } from '../agent.models';

@Component({
  selector: 'app-merchant-list',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.scss',
})
export class MerchantListComponent implements OnInit {
  data!: MerchantModel[];
  Loading = true;

  constructor(private merchantService: AgentService) {}

  ngOnInit(): void {
    this.getDataMerchant();
  }

  getDataMerchant(): void {
    this.merchantService.getMerchantInfos().subscribe({
      next: response => {
        this.data = response.objects;
        this.Loading = false;
      },
      error: error => {
        console.error(error);
      },
    });
  }
}
