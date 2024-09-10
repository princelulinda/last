import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigutarionTarifComponent } from './configutarion-tarif.component';

describe('ConfigutarionTarifComponent', () => {
  let component: ConfigutarionTarifComponent;
  let fixture: ComponentFixture<ConfigutarionTarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigutarionTarifComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigutarionTarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
