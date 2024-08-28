import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './core/services';



@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private ApiLinkAgent = '/dbs/agent/info/';
  private ApiLinkMerchant = '/dbs/agent/merchants-created/ ';

  constructor (private apiService : ApiService) {}

  getAgentInfos (): Observable <any> { 
    return this.apiService.get(this.ApiLinkAgent).pipe(map(data => data));
  }

  getMerchantInfos (): Observable <any> { 
    return this.apiService.get(this.ApiLinkMerchant).pipe(map(data => data));
  }

}
