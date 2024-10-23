import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import {
  AgentResModel,
  MerchantModel,
} from '../../../components/dev/agent/agent.models';
import { AgentModel } from '../../../components/agent/agent.model';

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

  getAgentsDetails(id: string): Observable<{ object: AgentModel }> {
    return this.apiService
      .get<{ object: AgentModel }>('/dbs/agents/' + id + '/')
      .pipe(map(data => data));
  }
}
