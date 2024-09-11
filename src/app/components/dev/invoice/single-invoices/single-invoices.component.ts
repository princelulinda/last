import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-invoices',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './single-invoices.component.html',
  styleUrl: './single-invoices.component.scss',
})
export class SingleInvoicesComponent {}
