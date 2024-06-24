import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchPlateformIconsComponent } from './switch-plateform-icons.component';

describe('SwitchPlateformIconsComponent', () => {
  let component: SwitchPlateformIconsComponent;
  let fixture: ComponentFixture<SwitchPlateformIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchPlateformIconsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchPlateformIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
