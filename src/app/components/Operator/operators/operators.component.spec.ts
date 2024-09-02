import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorsComponent } from './operators.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('OperatorsComponent', () => {
  let component: OperatorsComponent;
  let fixture: ComponentFixture<OperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
