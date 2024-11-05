import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent implements OnInit {
  @Input() fullName: string | undefined = '';
  @Input() imageUrl: string | null | undefined = null;
  @Input({ required: true }) width = '';

  @Input({ required: true }) height = '';
  @Input() classes = '';
  @Input() radiusClass = 'rounded-circle';

  initials = '';

  ngOnInit(): void {
    if (!this.imageUrl) {
      this.calculateInitials();
    }
  }

  calculateInitials(): void {
    if (this.fullName) {
      const names = this.fullName.split(' ');
      this.initials = names
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
  }
}
