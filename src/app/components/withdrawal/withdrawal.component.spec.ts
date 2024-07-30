import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalComponent } from './withdrawal.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('WithdrawalComponent', () => {
  let component: WithdrawalComponent;
  let fixture: ComponentFixture<WithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawalComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
