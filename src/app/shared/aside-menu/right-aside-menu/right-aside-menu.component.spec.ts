import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightAsideMenuComponent } from './right-aside-menu.component';

describe('RightAsideMenuComponent', () => {
  let component: RightAsideMenuComponent;
  let fixture: ComponentFixture<RightAsideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightAsideMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RightAsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
