import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDesignTestComponent } from './operator-design-test.component';

describe('OperatorDesignTestComponent', () => {
  let component: OperatorDesignTestComponent;
  let fixture: ComponentFixture<OperatorDesignTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorDesignTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorDesignTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
