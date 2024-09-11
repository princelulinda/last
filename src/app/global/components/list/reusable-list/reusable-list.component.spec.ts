import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableListComponent } from './reusable-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ReusableListComponent', () => {
  let component: ReusableListComponent;
  let fixture: ComponentFixture<ReusableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // RouterModule.forRoot(AuthRoutes),
      ],
      imports: [ReusableListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReusableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
