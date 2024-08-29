import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AgentResModel } from '../../../components/dev/agent/agent.models';
import { MerchantModel } from '../../../components/merchant/merchant.models';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private ApiLinkAgent = '/dbs/agent/info/';
  private ApiLinkMerchant = '/dbs/agent/merchants-created/';

  constructor(private apiService: ApiService) {}

  getAgentInfos(): Observable<{ object: AgentResModel }> {
    return this.apiService
      .get(this.ApiLinkAgent)
      .pipe(map(data => data as { object: AgentResModel }));
  }

  getMerchantInfos(): Observable<{ objects: MerchantModel[] }> {
    return this.apiService
      .get(this.ApiLinkMerchant)
      .pipe(map(data => data as { objects: MerchantModel[] }));
  }
}
