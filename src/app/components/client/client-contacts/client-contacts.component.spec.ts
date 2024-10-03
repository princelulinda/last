import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContactsComponent } from './client-contacts.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ClientContactsComponent', () => {
  let component: ClientContactsComponent;
  let fixture: ComponentFixture<ClientContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [ClientContactsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientContactsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
