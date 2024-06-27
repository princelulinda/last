import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsFeedService {
  constructor(private apiService: ApiService) {}

  getClientProducts() {
    const url = `/dbs/merchant-product/?limit=4`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getBillers() {
    const url = `/dbs/merchant/manage/objects_autocomplete/?is_biller=true`;
    return this.apiService.get(url).pipe(map(data => data));
  }

  getPublicationType() {
    const url = '/socialnetwork/publication-type/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  getPublication() {
    const url = '/socialnetwork/publication/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  getPublicationCategory() {
    const url = '/socialnetwork/publication-category/';
    return this.apiService.get(url).pipe(map(data => data));
  }

  pubicationComments() {
    const url = '/socialnetwork/publication-comments/';
    return this.apiService.get(url).pipe(map(data => data));
  }
}
