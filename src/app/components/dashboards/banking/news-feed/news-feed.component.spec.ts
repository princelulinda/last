import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFeedComponent } from './news-feed.component';
import { provideHttpClient } from '@angular/common/http';

describe('NewsFeedComponent', () => {
  let component: NewsFeedComponent;
  let fixture: ComponentFixture<NewsFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsFeedComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
