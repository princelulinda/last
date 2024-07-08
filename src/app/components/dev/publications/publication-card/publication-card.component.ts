import { Component, Input } from '@angular/core';
import { PublicationModel } from '../../../dashboards/dashboard.model';

@Component({
  selector: 'app-publication-card',
  standalone: true,
  imports: [],
  templateUrl: './publication-card.component.html',
  styleUrl: './publication-card.component.scss',
})
export class PublicationCardComponent {
  @Input({ required: true }) data: PublicationModel = {
    caption: '',
    category: {
      created_at: '',
      id: 0,
      name: '',
    },
    documents: [
      {
        docfile: '',
      },
    ],
    publishers: [
      {
        client_full_name: '',
        picture: '',
        id: 0,
      },
    ],
    total_reactions: 0,
    total_replies: 0,
    total_shares: 0,
  };
}
