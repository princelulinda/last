import { Component } from '@angular/core';
import { TestComponent } from '../../test/test.component';
@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [TestComponent],
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.scss',
})
export class TestListComponent {}
