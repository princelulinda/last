import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupIndividualComponent } from './lookup-individual.component';

describe('LookupIndividualComponent', () => {
  let component: LookupIndividualComponent;
  let fixture: ComponentFixture<LookupIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupIndividualComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LookupIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
