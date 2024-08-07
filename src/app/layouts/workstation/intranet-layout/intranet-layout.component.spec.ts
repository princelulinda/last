import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntranetLayoutComponent } from './intranet-layout.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('IntranetLayoutComponent', () => {
  let component: IntranetLayoutComponent;
  let fixture: ComponentFixture<IntranetLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntranetLayoutComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(IntranetLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
