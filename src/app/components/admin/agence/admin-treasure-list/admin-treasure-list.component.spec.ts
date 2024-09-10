import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTreasureListComponent } from './admin-treasure-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminTreasureListComponent', () => {
  let component: AdminTreasureListComponent;
  let fixture: ComponentFixture<AdminTreasureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTreasureListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTreasureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
