import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ToWords } from 'to-words';
import { ToWordsOptions } from 'to-words/dist/types';

@Component({
  selector: 'app-amount-field',
  standalone: true,
  imports: [NgClass, NgStyle, CommonModule, ReactiveFormsModule],
  templateUrl: './amount-field.component.html',
  styleUrl: './amount-field.component.scss',
})
export class AmountFieldComponent implements OnInit {
  toWords!: ToWords;

  amount: number | null = null;
  amountWords = '';
  amountInput: FormControl = new FormControl('');
  // fees: any = null; // Type this based on what your fees object is
  isLoading = false;

  @Input() language = '';
  @Output() amountEvent = new EventEmitter<{ amount: number | null }>();
  @Input() background = '';
  @Input() activeBorder = false;
  @Input() isFormFloating = true;

  // input for fees
  @Input() showFees = false;
  @Input() showAmountwords = true;
  @Input() typeCode: string | null = null;
  @Input() bankId: string | null = null;
  // @Output() feesEvent = new EventEmitter<any>();
  @Input() acceptZero = false;
  totalWithFees: number | null = null;

  constructor() {
    //comment
  }

  ngOnInit() {
    this.toWords = new ToWords({
      localeCode: this.language || 'en-GB',
      currency: true,
    } as ToWordsOptions);
  }

  newAmount() {
    const inputValue = this.amountInput.value?.toString();
    if (inputValue) {
      const cleanedAmount = inputValue.replace(/[^0-9.]/g, '');
      const parsedAmount = parseFloat(cleanedAmount);

      if (!isNaN(parsedAmount) && (parsedAmount !== 0 || this.acceptZero)) {
        this.amount = parsedAmount;
        const formattedAmount = parsedAmount.toLocaleString();
        this.amountInput.setValue(formattedAmount);
        this.amountEvent.emit({ amount: this.amount });
        this.convertAmountToWords(this.amount);
      } else {
        this.amountWords = '';
        this.amountInput.setValue('');
        this.amountEvent.emit({ amount: null });
      }
    } else {
      this.amountEvent.emit({ amount: null });
      this.amountWords = '';
    }
  }

  private convertAmountToWords(amount: number) {
    if (amount) {
      this.amountWords = this.toWords.convert(this.amount as number, {
        currency: true,
        currencyOptions: {
          name: 'BIF',
          plural: 'BIF',
          symbol: '',
          fractionalUnit: {
            name: '',
            plural: '',
            symbol: '',
          },
        },
      });
    }
  }
  // getFees() {
  //     this.isLoading = true;
  //     if (this.typeCode && this.amountInput.value && this.bankId) {
  //         this.tarifService
  //             .getSimulate(this.typeCode, this.amount, this.bankId)
  //             .subscribe({
  //                 next: (response) => {
  //                     this.isLoading = false;
  //                     this.fees = response.objects[0];
  //                     this.feesEvent.emit(this.fees);
  //                     this.totalWithFees = this.fees + this.amount;
  //                 },
  //                 error: (err) => {
  //                     this.isLoading = false;
  //                 },
  //             });
  //     }
  // }
}
