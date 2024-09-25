import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationListComponent } from './operation-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('OperationListComponent', () => {
  let component: OperationListComponent;
  let fixture: ComponentFixture<OperationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
