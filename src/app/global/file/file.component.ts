import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { FormControl } from '@angular/forms';
import { FileService } from '../../core/services/file/file.service';
import { fileResponse } from '../global.model';
@Component({
  selector: 'app-file',
  standalone: true,
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss',
})
export class FileComponent {
  @Input() uploadMultipleFile: boolean | undefined;
  @Input() uploadMultipleFile2: boolean | undefined;
  @Input() uploadOneFile: boolean | undefined;

  @Output() uploadMultipleFilesEvent = new EventEmitter<string>();
  @Output() uploadOneFileEvent = new EventEmitter<string>();
  test: File | undefined;

  constructor(
    // private sanitizer: DomSanitizer,
    private fileService: FileService,
    // private store: Store,
    private changeDetector: ChangeDetectorRef
  ) {}
  uploadedFiles: fileResponse[] = [];
  uploadedFile: fileResponse[] = [];

  progress = 0;
  isLoadingFile = false;
  isLoadingFileById = false;
  isLoadingDelete = false;

  fileFormat!: string;

  image!: string;
  file = new FormControl('');
  selectedImage!: string;

  uploadProfileImage(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList) {
      const file = fileList.length;
      for (let i = 0; i < file; i++) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          this.image = event.target?.result as string;
          // this..setValue(
          //     this.profileImage
          // );
          this.changeDetector.detectChanges();
        };
        reader.readAsDataURL(fileList[i]);
      }
    }
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files[0];
      this.convertToBase64(file);
    }
  }
  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Convert the image to Base64 using btoa()
      const base64Image = btoa(reader.result as string);
      this.selectedImage = `data:image/jpeg;base64,${base64Image}`;
    };
    if (file) {
      reader.readAsBinaryString(file);
    }
  }
  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const oneFile: FileList = inputElement.files;
      const filesArray: File[] = Array.from(oneFile);
      this.uploadFile(filesArray);
    }
  }

  private updateProgress(
    file: File & { progress: number; thumbnail: string | undefined },
    progress: number
  ): void {
    file.progress = progress;
  }

  getFileFormat(fileName: string): string {
    const fileParts = fileName.split('.');
    if (fileParts.length > 1) {
      return fileParts[fileParts.length - 1];
    }
    return '';
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      this.fileFormat = this.getFileFormat(file.name);
      console.log('File format:', this.fileFormat);
    }
  }

  oneFile: (File & {
    progress: number;
    thumbnail: string | undefined;
    isLoadingFile: boolean;
  })[] = [];

  private uploadFile(oneFile: File[]): void {
    const filesToUpload: (File & {
      progress: number;
      thumbnail: string | undefined;
      isLoadingFile: boolean;
    })[] = oneFile.map(file => ({
      ...file,
      progress: 0,
      thumbnail: undefined,
      isLoadingFile: true,
    }));

    this.oneFile.push(...filesToUpload);

    filesToUpload.forEach(file => {
      const formData = new FormData();
      const blob = new Blob([file], { type: file.type });
      formData.append('file', blob);

      const uploadReq = this.fileService.uploadFile();
      uploadReq.subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress) {
            const newProgress = Math.round(
              (event.loaded / (event.total ?? 0)) * 90
            );
            this.updateProgress(file, newProgress);
          }
          if (event.type === HttpEventType.Response) {
            const responseObject = event.body;
            this.uploadedFile.push(responseObject as fileResponse);
            this.updateProgress(file, 100);
            file.isLoadingFile = false;

            const test = this.uploadedFile[0]?.object.uuid;
            this.uploadOneFileEvent.emit(test);
            console.log('UUID:', test);
          }
        },
        error: () => {
          // Handle error
          const index = this.oneFile.findIndex(f => f === file);
          if (index !== -1) {
            this.oneFile.splice(index, 1);
          }
        },
      });
    });
  }

  // onFilesChange(event: Event): void {
  //     const inputElement = event.target as HTMLInputElement;
  //     if (inputElement.files) {
  //       const fileList: FileList = inputElement.files;
  //       const filesArray: File[] = Array.from(fileList);
  //       this.uploadFiles(filesArray);
  //     }
  //   }

  // onDragOver(event: DragEvent): void {
  //     event.preventDefault();
  //     event.stopPropagation();
  // }

  // onDragLeave(event: DragEvent): void {
  //     event.preventDefault();
  //     event.stopPropagation();
  // }

  // onDrop(event: DragEvent): void {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     const files: FileList | undefined = event.dataTransfer?.files;
  //     if (files && files.length > 0) {
  //         this.uploadFiles(Array.from(files));
  //     }
  // }

  // fileList: (File & {
  //     progress: number;
  //     thumbnail: string | undefined;
  //     isLoadingFile: boolean;
  // })[] = [];

  // private uploadFiles(fileList: File[]): void {
  //     const filesToUpload = fileList.map((file) => {
  //         return Object.assign(file, {
  //             progress: 0,
  //             thumbnail: undefined,
  //             isLoadingFile: true,
  //         });
  //     });

  //     // this.fileList.push(...filesToUpload);

  //     filesToUpload.forEach((file) => {
  //         const uploadReq = this.fileService.uploadFiles(file);
  //         uploadReq.subscribe({
  //             next: (data: any) => {
  //                 if (data.type === HttpEventType.UploadProgress) {
  //                     const newProgress = Math.round(
  //                         (data.loaded / data.total) * 100
  //                     );
  //                     this.updateProgress(file, newProgress);
  //                 } else if (data.type === HttpEventType.Response) {
  //                     const responseObject = data.body.object;
  //                     const fileSizeKB = Math.round(file.size / 1024);
  //                     responseObject.size =
  //                         fileSizeKB.toLocaleString() + ' k B';
  //                     this.uploadedFiles.push(responseObject);
  //                     this.updateProgress(file, 100);
  //                     file.isLoadingFile = false;

  //                     // this.uploadMultipleFilesEvent.emit(this.uploadedFiles);

  //                     const index = this.fileList.findIndex(
  //                         (f) => f === file
  //                     );
  //                     if (index !== -1) {
  //                         this.fileList.splice(index, 1);
  //                     }
  //                 }
  //             },
  //             error: (error) => {
  //                 // Handle error
  //                 // this.store.dispatch(new CloseDialog({ response: 'clear' }));
  //                 const data = {
  //                     title: '',
  //                     type: 'failed',
  //                     message:
  //                         error?.object?.response_message ??
  //                         'Something went wrong, please retry again',
  //                 };
  //                 // this.store.dispatch(new OpenDialog(data));
  //                 const index = this.fileList.findIndex((f) => f === file);
  //                 if (index !== -1) {
  //                     this.fileList.splice(index, 1);
  //                 }
  //             },
  //         });
  //     });
  // }
}
