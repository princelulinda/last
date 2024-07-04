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
  @Input({ required: true }) data!: PublicationModel;
}
