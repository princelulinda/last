import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCorporateComponent } from './auth-corporate.component';

describe('AuthCorporateComponent', () => {
  let component: AuthCorporateComponent;
  let fixture: ComponentFixture<AuthCorporateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCorporateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
