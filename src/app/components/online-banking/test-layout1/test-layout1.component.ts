import { Component } from '@angular/core';

@Component({
  selector: 'app-test-layout1',
  standalone: true,
  imports: [],
  templateUrl: './test-layout1.component.html',
  styleUrl: './test-layout1.component.scss',
})
export class TestLayout1Component {
  constructor() {
    console.log('testComponent créé !');
  }
}
