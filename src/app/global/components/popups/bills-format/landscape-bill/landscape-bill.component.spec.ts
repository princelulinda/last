import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandscapeBillComponent } from './landscape-bill.component';

describe('LandscapeBillComponent', () => {
  let component: LandscapeBillComponent;
  let fixture: ComponentFixture<LandscapeBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandscapeBillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandscapeBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
