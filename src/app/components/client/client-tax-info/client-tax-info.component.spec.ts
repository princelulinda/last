import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTaxInfoComponent } from './client-tax-info.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClientTaxInfoComponent', () => {
  let component: ClientTaxInfoComponent;
  let fixture: ComponentFixture<ClientTaxInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [ClientTaxInfoComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientTaxInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
