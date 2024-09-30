import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSensitiveInfoComponent } from './client-sensitive-info.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('ClientSensitiveInfoComponent', () => {
  let component: ClientSensitiveInfoComponent;
  let fixture: ComponentFixture<ClientSensitiveInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
      imports: [ClientSensitiveInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSensitiveInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
