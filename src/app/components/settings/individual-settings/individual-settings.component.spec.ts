import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualSettingsComponent } from './individual-settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('IndividualSettingsComponent', () => {
  let component: IndividualSettingsComponent;
  let fixture: ComponentFixture<IndividualSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualSettingsComponent, RouterTestingModule],

      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualSettingsComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
