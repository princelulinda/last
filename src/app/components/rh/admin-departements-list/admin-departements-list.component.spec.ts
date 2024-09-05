import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartementsListComponent } from './admin-departements-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminDepartementsListComponent', () => {
  let component: AdminDepartementsListComponent;
  let fixture: ComponentFixture<AdminDepartementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDepartementsListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // RouterModule.forRoot(AuthRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDepartementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
