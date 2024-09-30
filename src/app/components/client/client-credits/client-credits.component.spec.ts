import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreditsComponent } from './client-credits.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ClientCreditsComponent', () => {
  let component: ClientCreditsComponent;
  let fixture: ComponentFixture<ClientCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreditsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
