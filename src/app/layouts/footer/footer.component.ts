import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  @Input() showCopyRight = true;
  @Input() break = false;
  year!: number;

  ngOnInit() {
    this.year = new Date(Date.now()).getFullYear();
  }
}
