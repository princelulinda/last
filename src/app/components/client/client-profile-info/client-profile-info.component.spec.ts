import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfileInfoComponent } from './client-profile-info.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('ClientProfileInfoComponent', () => {
  let component: ClientProfileInfoComponent;
  let fixture: ComponentFixture<ClientProfileInfoComponent>;

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
      imports: [ClientProfileInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
