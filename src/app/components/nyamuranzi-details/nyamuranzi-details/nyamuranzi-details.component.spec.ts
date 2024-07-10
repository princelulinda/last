import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyamuranziDetailsComponent } from './nyamuranzi-details.component';

describe('NyamuranziDetailsComponent', () => {
  let component: NyamuranziDetailsComponent;
  let fixture: ComponentFixture<NyamuranziDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NyamuranziDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NyamuranziDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
