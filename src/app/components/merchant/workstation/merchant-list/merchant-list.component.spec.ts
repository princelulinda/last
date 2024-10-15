import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantListComponent } from './merchant-list.component';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('MerchantListComponent', () => {
  let component: MerchantListComponent;
  let fixture: ComponentFixture<MerchantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantListComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClient(),
        // RouterModule.forRoot(AuthRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
