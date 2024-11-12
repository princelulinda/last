import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import {
  AgentResModel,
  MerchantModel,
} from '../../../components/dev/agent/agent.models';
import { AgentModel } from '../../../components/agent/agent.model';
import { PaginationConfig } from '../../../global/models/pagination.models';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private apiService: ApiService) {}

  getAgentInfos(): Observable<{ object: AgentResModel }> {
    return this.apiService
      .get<{ object: AgentResModel }>('/dbs/agent/info/')
      .pipe(map(data => data));
  }

  getMerchantInfos(
    pagination: PaginationConfig
  ): Observable<{ objects: MerchantModel[]; count: number }> {
    const url = `/dbs/agent/merchants-created/?limit=${pagination?.filters.limit}&offset=${pagination?.filters.offset}`;
    return this.apiService
      .get<{ objects: MerchantModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  getAgentsDetails(id: string): Observable<{ object: AgentModel }> {
    return this.apiService
      .get<{ object: AgentModel }>('/dbs/agents/' + id + '/')
      .pipe(map(data => data));
  }
}
