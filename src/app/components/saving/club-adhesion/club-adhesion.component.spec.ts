import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubAdhesionComponent } from './club-adhesion.component';

describe('ClubAdhesionComponent', () => {
  let component: ClubAdhesionComponent;
  let fixture: ComponentFixture<ClubAdhesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubAdhesionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubAdhesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
