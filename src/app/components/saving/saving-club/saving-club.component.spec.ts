import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SavingClubComponent } from './saving-club.component';

describe('SavingClubComponent', () => {
  let component: SavingClubComponent;
  let fixture: ComponentFixture<SavingClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingClubComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
