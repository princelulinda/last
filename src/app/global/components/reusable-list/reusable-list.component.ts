import { Component } from '@angular/core';

@Component({
  selector: 'app-reusable-list',
  standalone: true,
  imports: [],
  templateUrl: './reusable-list.component.html',
  styleUrl: './reusable-list.component.scss',
})
export class ReusableListComponent {
  // index=1;
  // open1=false;
  // open2=false;

  // open: boolean[] = [];
  // index:any;
  // ngOnInit() {
  //   this.open[this.index] = false;
  // }

  tableData = [
    {
      name: 'Pierre Claver',
      leaveType: 'Conges Maladie',
      description: 'Lorem ipsum...',
      startDate: '4/01/2024 12:00',
      endDate: '4/03/2024 12:00',
      status: 'Approved',
      duration: '2 days',
    },
    {
      name: 'John Doe',
      leaveType: 'Vacation',
      description: 'Visiting family',
      startDate: '5/15/2024 9:00',
      endDate: '5/20/2024 18:00',
      status: 'Pending',
      duration: '5 days',
    },
    // Add more data as needed
  ];
}
