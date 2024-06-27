import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubAdhesionComponent } from './club-adhesion.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('ClubAdhesionComponent', () => {
  let component: ClubAdhesionComponent;
  let fixture: ComponentFixture<ClubAdhesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubAdhesionComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubAdhesionComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
