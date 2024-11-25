import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  @Input() width = '';
  @Input({ required: true }) height = '';
  @Input() animation: 'glow' | 'wave' = 'wave';
  @Input() classes = 'sm-radius  ';
}
