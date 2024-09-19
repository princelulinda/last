import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepModeComponent } from './sleep-mode.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SleepModeComponent', () => {
  let component: SleepModeComponent;
  let fixture: ComponentFixture<SleepModeComponent>;

  beforeEach(async () => {
    const broadcastChannelMock = {
      postMessage: jest.fn(),
      onmessage: null,
      onmessageerror: null,
      close: jest.fn(),
      name: 'sleep-mode-channel',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
    window.BroadcastChannel = jest.fn(() => broadcastChannelMock);
    await TestBed.configureTestingModule({
      imports: [SleepModeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SleepModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
