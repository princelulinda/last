import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusComponent } from './menus.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('MenusComponent', () => {
  let component: MenusComponent;
  let fixture: ComponentFixture<MenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenusComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
