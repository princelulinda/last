import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-wallet-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-creation.component.html',
  styleUrl: './wallet-creation.component.scss',
})
export class WalletCreationComponent implements OnInit {
  walletForm!: FormGroup;

  constructor() {
    this.walletForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      type: new FormControl(''),
      pin: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(4),
      ]),
    });
  }

  onSubmit() {
    if (this.walletForm.valid) {
      console.log(this.walletForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
