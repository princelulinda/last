import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  data: string[][] = [];
  filteredData: string[][] = [];
  isDragging = false;
  editableCell: { row: number; col: number } | null = null;
  showModal = false;
  searchQuery = '';
  fileName = '';
  fileSize = 0;
  hoveredRowIndex: number | null = null;

  constructor(private elRef: ElementRef) {}

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      alert('Veuillez uploader un fichier Excel.');
      return;
    }

    this.fileName = file.name;
    this.fileSize = file.size;

    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const bstr: string = e.target?.result as string;
      if (bstr) {
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.filteredData = [...this.data];
      }
    };
    reader.readAsBinaryString(file);
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  filterTable(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredData = [...this.data];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredData = this.data.filter(row =>
        row.some(cell => cell?.toString().toLowerCase().includes(query))
      );
    }
  }

  editCell(rowIndex: number, colIndex: number): void {
    this.editableCell = { row: rowIndex, col: colIndex };
  }

  saveCell(value: string): void {
    if (this.editableCell) {
      const { row, col } = this.editableCell;
      this.data[row + 1][col] = value;
      this.filteredData = [...this.data];
      this.editableCell = null;
    }
  }

  cancelEdit(): void {
    this.editableCell = null;
  }

  deleteRow(rowIndex: number): void {
    this.data.splice(rowIndex + 1, 1);
    this.filteredData = [...this.data];
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.onFileChange({ target: { files: [file] } } as unknown as Event);
    }
  }
}
