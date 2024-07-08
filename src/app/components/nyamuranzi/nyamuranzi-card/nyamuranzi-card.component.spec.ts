import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyamuranziCardComponent } from './nyamuranzi-card.component';

describe('NyamuranziCardComponent', () => {
  let component: NyamuranziCardComponent;
  let fixture: ComponentFixture<NyamuranziCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NyamuranziCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NyamuranziCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
