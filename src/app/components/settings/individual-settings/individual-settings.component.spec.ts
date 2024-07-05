import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualSettingsComponent } from './individual-settings.component';

describe('IndividualSettingsComponent', () => {
  let component: IndividualSettingsComponent;
  let fixture: ComponentFixture<IndividualSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
