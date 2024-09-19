import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarifComponent } from './tarif.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TarifComponent', () => {
  let component: TarifComponent;
  let fixture: ComponentFixture<TarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // RouterModule.forRoot(AuthRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
