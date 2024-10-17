import { Routes } from '@angular/router';
import { NewsFeedComponent } from '../../components/dashboards/banking/news-feed/news-feed.component';
import { ChatComponent } from '../../components/chat/chat.component';

export const newsFeedRoutes: Routes = [
  { path: '', component: NewsFeedComponent },
  { path: 'chat', component: ChatComponent },
];
