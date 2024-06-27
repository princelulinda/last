import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SwitchPlateformIconsComponent } from './switch-plateform-icons.component';

describe('SwitchPlateformIconsComponent', () => {
  let component: SwitchPlateformIconsComponent;
  let fixture: ComponentFixture<SwitchPlateformIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchPlateformIconsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchPlateformIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
