import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedClientSmallOverviewComponent } from './selected-client-small-overview.component';

describe('SelectedClientSmallOverviewComponent', () => {
  let component: SelectedClientSmallOverviewComponent;
  let fixture: ComponentFixture<SelectedClientSmallOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedClientSmallOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedClientSmallOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
