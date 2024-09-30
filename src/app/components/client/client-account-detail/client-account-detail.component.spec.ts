import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountDetailComponent } from './client-account-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('ClientAccountDetailComponent', () => {
  let component: ClientAccountDetailComponent;
  let fixture: ComponentFixture<ClientAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [ClientAccountDetailComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
