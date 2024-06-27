import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubAdminComponent } from './club-admin.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ClubAdminComponent', () => {
  let component: ClubAdminComponent;
  let fixture: ComponentFixture<ClubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubAdminComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubAdminComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
