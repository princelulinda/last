import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NyamuranziDetailsComponent } from './nyamuranzi-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('NyamuranziDetailsComponent', () => {
  let component: NyamuranziDetailsComponent;
  let fixture: ComponentFixture<NyamuranziDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NyamuranziDetailsComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(NyamuranziDetailsComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
