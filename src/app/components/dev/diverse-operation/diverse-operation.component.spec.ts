import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiverseOperationComponent } from './diverse-operation.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DiverseOperationComponent', () => {
  let component: DiverseOperationComponent;
  let fixture: ComponentFixture<DiverseOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiverseOperationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DiverseOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
