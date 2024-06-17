import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  @Input({ required: true }) width = '';
  @Input({ required: true }) height = '';
  @Input({ required: true }) isLoading = true;
  @Input() count = 1;
  @Input() animation: 'glow' | 'wave' | '' = 'wave';
  @Input() color = '#e0e0e0';
  @Input() radius = '0px';

  getAnimationClass() {
    return this.animation ? `placeholder-${this.animation}` : '';
  }

  getPlaceholderArray() {
    return new Array(this.count);
  }
}
