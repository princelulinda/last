import { Component } from '@angular/core';
import { NotFoundPageComponent } from '../../global/components/empty-states/not-found-page/not-found-page.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NotFoundPageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {}
