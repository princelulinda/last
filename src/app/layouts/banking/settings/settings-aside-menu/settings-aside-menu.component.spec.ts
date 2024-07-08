import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAsideMenuComponent } from './settings-aside-menu.component';

describe('SettingsAsideMenuComponent', () => {
  let component: SettingsAsideMenuComponent;
  let fixture: ComponentFixture<SettingsAsideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAsideMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
