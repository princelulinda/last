import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigutarionTarifComponent } from './configutarion-tarif.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfigutarionTarifComponent', () => {
  let component: ConfigutarionTarifComponent;
  let fixture: ComponentFixture<ConfigutarionTarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigutarionTarifComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        // RouterModule.forRoot(AuthRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigutarionTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
