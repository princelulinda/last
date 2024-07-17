import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCorporateLayoutComponent } from './auth-corporate-layout.component';

describe('AuthCorporateLayoutComponent', () => {
  let component: AuthCorporateLayoutComponent;
  let fixture: ComponentFixture<AuthCorporateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCorporateLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCorporateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
