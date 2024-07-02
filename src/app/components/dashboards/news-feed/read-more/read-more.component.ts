import {
  AfterContentInit,
  Component,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-read-more',
  standalone: true,
  imports: [],
  templateUrl: './read-more.component.html',
  styleUrl: './read-more.component.scss',
})
export class ReadMoreComponent implements AfterContentInit {
  @Input() maxLength = 100;
  @ViewChild('content', { static: true }) content: ElementRef;

  fullText = '';
  truncatedText = '';
  isCollapsed = true;

  constructor() {
    this.content = new ElementRef(null);
  }

  ngAfterContentInit(): void {
    this.fullText = this.content.nativeElement.innerHTML;
    this.truncatedText =
      this.fullText.length > this.maxLength
        ? this.fullText.slice(0, this.maxLength) + '...'
        : this.fullText;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
