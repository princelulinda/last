import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandByComponent } from './stand-by.component';

describe('StandByComponent', () => {
  let component: StandByComponent;
  let fixture: ComponentFixture<StandByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandByComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StandByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
