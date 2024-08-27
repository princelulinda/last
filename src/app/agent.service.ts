import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './core/services';



@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private ApiLink = '/dbs/agent/info/';

  constructor (private apiService : ApiService) {}

  getAgentInfos (): Observable <any> { 
    return this.apiService.get(this.ApiLink).pipe(map(data => data));
  }
  
}
