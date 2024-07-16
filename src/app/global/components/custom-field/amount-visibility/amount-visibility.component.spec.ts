import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountVisibilityComponent } from './amount-visibility.component';

describe('AmountVisibilityComponent', () => {
  let component: AmountVisibilityComponent;
  let fixture: ComponentFixture<AmountVisibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountVisibilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
