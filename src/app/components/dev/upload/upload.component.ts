import { Component, ElementRef, HostListener, output } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  standalone: true,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  fileUploaded = output<{
    data: string[][];
    fileName: string;
    fileSize: number;
  }>();

  isDragging = false;

  constructor(private elRef: ElementRef) {}

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      alert('Veuillez uploader un fichier Excel.');
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const bstr: string = e.target?.result as string;
      if (bstr) {
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.fileUploaded.emit({
          data: data as string[][],
          fileName: file.name,
          fileSize: file.size,
        });
      }
    };
    reader.readAsBinaryString(file);
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
