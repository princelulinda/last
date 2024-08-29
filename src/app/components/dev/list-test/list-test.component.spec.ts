import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTestComponent } from './list-test.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListTestComponent', () => {
  let component: ListTestComponent;
  let fixture: ComponentFixture<ListTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTestComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
