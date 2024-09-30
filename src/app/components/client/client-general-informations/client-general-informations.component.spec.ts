import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGeneralInformationsComponent } from './client-general-informations.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('ClientGeneralInformationsComponent', () => {
  let component: ClientGeneralInformationsComponent;
  let fixture: ComponentFixture<ClientGeneralInformationsComponent>;

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
      imports: [ClientGeneralInformationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientGeneralInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
