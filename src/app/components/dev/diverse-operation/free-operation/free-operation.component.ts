import { Component } from '@angular/core';
import { UploadComponent } from '../../upload/upload.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';

@Component({
  selector: 'app-free-operation',
  standalone: true,
  imports: [UploadComponent, FormsModule, CommonModule, LookupComponent],
  templateUrl: './free-operation.component.html',
  styleUrls: ['./free-operation.component.scss'],
})
export class FreeOperationComponent {
  data: { data: string[][]; fileName: string; fileSize: number } | null = null;
  filteredData: string[][] = [];
  searchQuery = '';
  editableCell: { row: number; col: number } | null = null;
  fileName!: string;
  fileSize!: number;
  hoveredRowIndex: number | null = null;
  isEditTable = false;

  handleFileUpload(data: {
    data: string[][];
    fileName: string;
    fileSize: number;
  }): void {
    this.data = data;
    this.filteredData = data?.data ? [...data.data] : [];
    this.fileName = data.fileName;
    this.fileSize = data.fileSize;
  }

  editTable(): void {
    this.isEditTable = true;
  }

  filterTable(): void {
    if (!this.data?.data) {
      this.filteredData = [];
      return;
    }

    if (this.searchQuery.trim() === '') {
      this.filteredData = [...this.data.data];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredData = this.data.data.filter(row =>
        row.some(cell => cell?.toString().toLowerCase().includes(query))
      );
    }
  }

  editCell(rowIndex: number, colIndex: number): void {
    this.editableCell = { row: rowIndex, col: colIndex };
  }

  saveCell(): void {
    this.editableCell = null;
  }

  deleteRow(rowIndex: number): void {
    if (this.data?.data) {
      this.data.data.splice(rowIndex, 1);
      this.filteredData = [...this.data.data];
    }
  }
}
