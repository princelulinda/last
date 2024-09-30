import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreditsLineComponent } from './client-credits-line.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ClientCreditsLineComponent', () => {
  let component: ClientCreditsLineComponent;
  let fixture: ComponentFixture<ClientCreditsLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreditsLineComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientCreditsLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
