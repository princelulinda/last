import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferComponent } from './transfer.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransferComponent', () => {
  let component: TransferComponent;
  let fixture: ComponentFixture<TransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
