import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountListComponent } from './client-account-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClientAccountListComponent', () => {
  let component: ClientAccountListComponent;
  let fixture: ComponentFixture<ClientAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [ClientAccountListComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAccountListComponent);
    component = fixture.componentInstance;
    //  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
