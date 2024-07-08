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

  dateFormatter(createdAt: string) {
    const date = new Date(createdAt);

    if (isNaN(date.getTime())) {
      throw new RangeError('Invalid time value');
    }

    const options: Intl.DateTimeFormatOptions = {
      // year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const formattedDate: string = formatter.format(date);
    const [datePart, timePart] = formattedDate.split(', ');

    return `${datePart} at ${timePart}`;
  }
}
