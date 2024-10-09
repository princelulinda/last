import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantDetailsComponent } from './merchant-details.component';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('MerchantDetailsComponent', () => {
  let component: MerchantDetailsComponent;
  let fixture: ComponentFixture<MerchantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantDetailsComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClient(),
        // RouterModule.forRoot(AuthRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
