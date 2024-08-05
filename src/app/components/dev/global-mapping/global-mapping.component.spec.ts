import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMappingComponent } from './global-mapping.component';

describe('GlobalMappingComponent', () => {
  let component: GlobalMappingComponent;
  let fixture: ComponentFixture<GlobalMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalMappingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
