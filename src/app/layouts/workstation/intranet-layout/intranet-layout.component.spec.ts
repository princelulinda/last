import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntranetLayoutComponent } from './intranet-layout.component';

describe('IntranetLayoutComponent', () => {
  let component: IntranetLayoutComponent;
  let fixture: ComponentFixture<IntranetLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntranetLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntranetLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
