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
  @Input() fullName = '';
  @Input() imageUrl: string | null = null;

  initials = '';

  ngOnInit(): void {
    if (!this.imageUrl) {
      this.calculateInitials();
    }
  }

  calculateInitials(): void {
    const names = this.fullName.split(' ');
    this.initials = names
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }
}
