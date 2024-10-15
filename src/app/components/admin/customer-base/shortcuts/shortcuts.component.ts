import { Component } from '@angular/core';
import { VariableService } from '../../../../core/services/variable/variable.service';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { NgClass } from '@angular/common';
import { AccountComponent } from '../../../account/account/account.component';
import { LookupIndividualComponent } from '../../../dev/lookup-individual/lookup-individual.component';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { LoanRequestComponent } from '../../../loan/loan-request/loan-request.component';

@Component({
  selector: 'app-shortcuts',
  standalone: true,
  imports: [
    NgClass,
    AccountComponent,
    LookupIndividualComponent,
    LookupComponent,
    LoanRequestComponent,
  ],
  templateUrl: './shortcuts.component.html',
  styleUrl: './shortcuts.component.scss',
})
export class ShortcutsComponent {
  selectedCuts = '';
  crumbs = [
    {
      label: 'Shortcuts',
    },
    {
      label: this.selectedCuts,
      active: true,
    },
  ];

  theme!: string;
  // theme$: Observable<any>;

  constructor(
    private variableService: VariableService,
    private dialogService: DialogService
  ) {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
  }

  // ngOnInit() {

  // }

  selectCuts(name: string) {
    this.selectedCuts = name;
    // this.variableService.setSelectedCrumb(this.selectedCuts);
  }
  openPinPopup() {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Enter your PIN to see the balance.',
      action: 'confirmation',
    });
  }
}
