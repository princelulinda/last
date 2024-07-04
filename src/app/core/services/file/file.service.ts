import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  uploadSingleFile!: string;
  downloadFile!: string;
  deleteFiles!: number;
  progress!: number;
  thumbnails: SafeUrl[] = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  uploadFiles() {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/octet-stream');
    const path = '/documents/';
    return this.http.post(environment.apiUrl + path, formData, {});
  }

  uploadFile() {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/octet-stream');
    const path = '/documents/';
    return this.http.post(environment.apiUrl + path, formData, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }
}
