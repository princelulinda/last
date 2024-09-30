import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FileComponent } from '../../../global/components/file/file.component';
import { ClipboardDirective } from '../../../global/directives/clipboard/clipboard.directive';
import {
  ClientService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import { ModeModel } from '../../../core/services/config/main-config.models';
import {
  ClientCorporateModel,
  ClientWorkstationModel,
  IndividualClientModel,
  ResponseDataForClientModel,
} from '../client.model';
import { FileResponseModel } from '../../../global/components/file/file.model';

@Component({
  selector: 'app-client-profile-info',
  standalone: true,
  imports: [CommonModule, FileComponent, ClipboardDirective],
  templateUrl: './client-profile-info.component.html',
  styleUrl: './client-profile-info.component.scss',
})
export class ClientProfileInfoComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input() clientIndiv!: IndividualClientModel | null;
  @Input() clientEntreprise!: ClientCorporateModel | null;
  @Input() selectedClient!: ClientWorkstationModel;
  @Output() refreshUpdates = new EventEmitter<string>();
  profilePicture!: string;
  clientId!: string;
  isLoading = false;
  title!: string;

  modifyProfile = false;
  updateReady = false;

  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  constructor(
    private clientService: ClientService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.theme$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    if (this.clientIndiv) {
      this.clientId = this.clientIndiv.ident as string;
      if (this.clientIndiv.picture) {
        this.title = 'Modify the profile picture';
      } else {
        this.title = 'Add a profile picture';
      }
    } else if (this.clientEntreprise) {
      this.clientId = this.clientEntreprise.ident as string;
    }
  }

  modifyProfilePicture() {
    this.modifyProfile = true;
  }
  updateProfilePicture() {
    this.isLoading = true;

    const data = {
      email: (this.clientIndiv as IndividualClientModel).email,
      write_picture: this.profilePicture,
      telephones: (this.clientIndiv as IndividualClientModel).telephones,
    };

    this.clientService
      .UpdateIndividualClientDetails(this.clientId, data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const res = response as { object: ResponseDataForClientModel };
          if (response || res.object.success === true) {
            this.isLoading = false;
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message:
                res.object.response_message ??
                'Profile Picture is updated successfully',
            });
            this.refreshUpdates.emit('updated');
            this.updateReady = false;
            this.modifyProfile = false;
          } else if (res.object.success === false) {
            this.isLoading = false;
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: res.object.response_message,
            });
          }
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please try again',
          });
        },
      });
  }

  collectProfile(profile: FileResponseModel[]) {
    this.profilePicture = profile[0].object.uuid;
    this.updateReady = true;
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
