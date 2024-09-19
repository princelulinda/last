import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupIndividualComponent } from './lookup-individual.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LookupIndividualComponent', () => {
  let component: LookupIndividualComponent;
  let fixture: ComponentFixture<LookupIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupIndividualComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LookupIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
