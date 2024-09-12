import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTarifComponent } from './config-tarif.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfigTarifComponent', () => {
  let component: ConfigTarifComponent;
  let fixture: ComponentFixture<ConfigTarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigTarifComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        // RouterModule.forRoot(AuthRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigTarifComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
