import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { HumanityFileUpload, HumanityFile } from '../../../../../core/apps/_models/file-upload.model';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { AppState } from '../../../../../core/reducers';
import { Store, select } from '@ngrx/store';
import {
	HumanityFileOnServerMultipleUploaded,
	CleanStore,
	DeleteFileRequested,
	DeleteFileTempRequested,
} from '../../../../../core/apps/_actions/file-upload.actions';
import {
	selectHumanityUploaded,
	selectFileUploadError,
	isFileDeleted,
	selectFileDeletedErr,
	isDeleteFileTempSucceed,
} from '../../../../../core/apps/_selectors/file-upload.selectors';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';

@Component({
	selector: 'kt-image-preview',
	templateUrl: './image-preview.component.html',
	styleUrls: ['./image-preview.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class ImagePreviewComponent implements OnInit, OnDestroy {
	@ViewChild('uploadfile', { static: false }) uploadValue: ElementRef;
	formGroup: FormGroup;
	picsArray: FormArray;

	// Public properties
	viewLoading = false;
	showDescription = false;
	hasErrors = false;
	isUploaded = false;
	messErr = '';
	selected = 'none';

	// all fileId picture
	// selectedPicture: number[] = [];

	humanityId;
	documentType;
	prev = {
		name: '',
		value: true,
	};
	imagePath = '';
	imgURL: any;

	isUploadCall = false;
	isFileDeletedCall = false;

	subcriptions: Subscription = new Subscription();

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<ImagePreviewComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<ImagePreviewComponent>,
		private translate: TranslateService,
		private formBuilder: FormBuilder,
		private store: Store<AppState>,
		private snackBar: MatSnackBar,
		private http: HttpClient,
		private changeDetectorRef: ChangeDetectorRef,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		this.formGroup = this.formBuilder.group({
			picsArray: this.formBuilder.array([])
		});
		this.picsArray = this.formGroup.controls.picsArray as FormArray;
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 *
	 */
	ngOnInit() {
		this.data.fileList.forEach((x) => {
			this.addFormArray(x);
		});
	}


	ngOnDestroy() {
		this.subcriptions.unsubscribe();
		this.store.dispatch(new CleanStore());
	}

	/**
	 * Selected Image Change Value on FormArray
	 * picsArray: FormArray  => contain State of Picture ( fileId, value: boolean)
	 *
	 * @param index :number
	 */
	fileSelected(index: number) {
		this.selected = '';
		const val = this.picsArray.value;
		val[index].value = !val[index].value;
		const isSelected = this.picsArray.value.filter(pic => pic.value === true);
		if (isSelected.length === val.length) {
			this.selected = 'all';
		}
		if (isSelected.length === 0) {
			this.selected = 'none';
		}
		// if(this.picsArray.value)
	}

	/**
	 * Upload Picture Add FormArray
	 *
	 * @param id :number
	 */
	addFormArray(humanityFile: HumanityFile) {
		this.picsArray.push(this.formBuilder.group({
			fileId: humanityFile.fileId,
			fileNameUpload: humanityFile.fileNameUpload,
			pathFileServer: humanityFile.pathFileServer,
			value: false
		}));
	}

	/**
	 * Call Delete All Selected Picture
	 */
	removeSelected() {
		const links = [];
		this.picsArray.value.map(pic => {
			if (pic.value) {
				links.push(pic.pathFileServer);
				this.remmoveFormArray(pic.fileId);
			}
		});
		this.store.dispatch(new DeleteFileTempRequested({ listLink: links }));

		this.selected = 'none';
		// this.selectedPicture = [];
		if (!this.isFileDeletedCall) {
			this.subcriptions.add(this.store.pipe(select(isDeleteFileTempSucceed)).subscribe(res => {
				if (res) {
					this.snackBar.dismiss();
					this.openSnackBar(this.translate.instant('MESSAGE.DELETE_SUCCESS'));
				}
			}));
			this.subcriptions.add(this.store.pipe(select(selectFileDeletedErr)).subscribe(res => {
				if (res) {
					this.openErrSnackbar(res);
				}
			}));
			this.isFileDeletedCall = true;
		}
	}

	callRemove() {

	}
	/**
	 * Clear Selected Picture in FormArray and in Picture
	 *
	 * @param fileId: number
	 */
	remmoveFormArray(fileId: number) {
		this.picsArray.removeAt(this.picsArray.value.findIndex(x => x.fileId === fileId));
		// this.selectedPicture = this.selectedPicture.filter(x => { if (x !== fileId) { return x; } });
	}

	chooseSelect(type) {
		// this.selectedPicture = [];
		if (type) {
			this.selected = 'all';
			this.picsArray.value.map(pic => pic.value = true);
		} else {
			this.selected = 'none';
			this.picsArray.value.map(pic => pic.value = false);
		}

		if (this.picsArray.value.length === 0) {
			this.selected = 'none';
			return;
		}
	}

	uploadFile(event) {
		if (this.selected === 'all') {
			this.selected = '';
		}
		this.hasErrors = false;
		this.isUploaded = true;
		this.viewLoading = true;
		const files: File[] = event.target.files;
		if (files.length === 0) {
			this.isUploaded = false;
			return;
		}
		const invalidFile = [];
		const invalidFileName = [];
		const formData = new FormData();
		// tslint:disable-next-line: prefer-for-of
		for (let index = 0; index < files.length; index++) {
			if (files[index].size <= 5000000) {
				formData.append('files', files[index]);
			} else {

				invalidFileName.push(files[index].name);
				invalidFile.push(files[index]);
			}
		}
		if (invalidFile.length > 0) {
			this.openSnackBar(`${invalidFile.length} ${this.translate.instant('MESSAGE.IMG_TOO_BIG')}:\n ${invalidFileName.join('; ')}`);
		}
		if (invalidFile.length === files.length) {
			this.isUploaded = false;
			this.viewLoading = false;
			this.uploadValue.nativeElement.value = null;
			return;
		}
		this.store.dispatch(new HumanityFileOnServerMultipleUploaded({ documentType: this.data.documentType, files: formData }));
		this.viewLoading = true;
		event = null;
		if (!this.isUploadCall) {
			this.isUploadCall = true;
			this.subcriptions.add(
				this.store.pipe(select(selectHumanityUploaded)).subscribe((res) => {
					if (res) {
						res.files.map(x => {
							this.addFormArray(x);
						});
						this.isUploaded = false;
						this.viewLoading = false;
						this.openSnackBar(res.message);
						this.uploadValue.nativeElement.value = null;
					}
				}),
			);

			this.subcriptions.add(
				this.store.pipe(select(selectFileUploadError)).subscribe(err => {
					if (err) {
						const error = err.error;
						if (error.returnMes) {
							this.openSnackBar(error.returnMes);
							return;
						}
						this.openSnackBar(error.message);
						this.isUploaded = false;
						this.uploadValue.nativeElement.value = null;		// this.uploadVal = null;
					}
				})
			);
		}
	}

	openErrSnackbar(err: HttpErrorResponse, message?: string) {
		const error = err.error;
		if (error.returnMes) {
			this.openSnackBar(error.returnMes + ' ' + message);
			return;
		}
		this.openSnackBar(error.message + ' ' + message);
	}

	openSnackBar(message: string, action?: string) {
		this.snackBar.dismiss();
		this.snackBar.open(message, this.translate.instant('BUTTON.CANCEL'), {
			duration: 4000,
		});

	}


	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}

	/**
	 * Close dialog with true result
	 */
	onYesClick(): void {
		this.picsArray.value.map(x => delete x.value);
		this.dialogRef.close(this.picsArray.value);
	}
}
