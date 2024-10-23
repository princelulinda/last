import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLineListComponent } from './credit-line-list.component';

describe('CreditLineListComponent', () => {
  let component: CreditLineListComponent;
  let fixture: ComponentFixture<CreditLineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditLineListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditLineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
