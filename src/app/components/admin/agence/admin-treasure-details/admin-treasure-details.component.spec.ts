import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTreasureDetailsComponent } from './admin-treasure-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminTreasureDetailsComponent', () => {
  let component: AdminTreasureDetailsComponent;
  let fixture: ComponentFixture<AdminTreasureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTreasureDetailsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTreasureDetailsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
