import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftAsideMenuComponent } from './left-aside-menu.component';

describe('LeftAsideMenuComponent', () => {
  let component: LeftAsideMenuComponent;
  let fixture: ComponentFixture<LeftAsideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftAsideMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeftAsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
