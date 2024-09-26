import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreditsLineComponent } from './client-credits-line.component';

describe('ClientCreditsLineComponent', () => {
  let component: ClientCreditsLineComponent;
  let fixture: ComponentFixture<ClientCreditsLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreditsLineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientCreditsLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
