// Angular
import { Injectable } from '@angular/core';
// RxJS
import { switchMap, map, tap, catchError, withLatestFrom, filter, mergeMap } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
// User Profile Action
import { FileUploadService } from '../_services/file-upload.service';

import {
	FileUploadActionTypes,
	FileUploadRequested,
	FileUploadSucceed,
	FileUploadFailed,
	FileRequestedById,
	FileRequestedSucceed,
	FileRequestedFailed,
	FileRequestedByURL,
	HumanityFileOnServerUploaded,
	HumanityFileUploaded,
	HumanityFileError,
	HumanityFileRequested,
	HumanityFileRequestedSucceed,
	HumanityFileOnServerMultipleUploaded,
	CleanStore,
	DeleteFileTempRequested,
	DeleteFileTempSucceed,
	DeleteFileRequested,
	DeleteFileSucceed,
	DeleteFileFailed,
	UploadAvatarCampaign,
	UploadAvatarCampaignSucceed,
	UploadAvatarCampaignFailed,
	CampaignUploadMutil,
	CampaignUploadMutilSuccess,
	CampaignUploadMutilError,
	CampaignUpload,
	CampaignUploadError,
	CampaignUploadSuccess,
	CampaignContentUpload,
	CampaignContentUploadSuccess,
	CampaignContentUploadError
} from '../_actions/file-upload.actions';
import { LayoutUtilsService } from '../../_base/crud';

@Injectable()
export class FileUploadEffects {

	@Effect()
	requestFileUpload$ = this.actions$
		.pipe(
			ofType<FileUploadRequested>(FileUploadActionTypes.FileUploadRequested),
			// switchMap((action) => this.fileUploadService.uploadFile(action.payload.type, action.payload.body).pipe(
			switchMap((action) => this.fileUploadService.uploadFile(action.payload.body).pipe(
				map(res => {
					return new FileUploadSucceed({ result: res });
				}), catchError(error => {
					return of(new FileUploadFailed({ err: error }));
				})
			))
		);

	@Effect()
	requestFileById$ = this.actions$
		.pipe(
			ofType<FileRequestedById>(FileUploadActionTypes.FileRequestedById),
			switchMap((action) => this.fileUploadService.getFile(action.payload.id).pipe(
				map(res => {
					return new FileRequestedSucceed({ data: res });
				}), catchError(error => {
					return of(new FileRequestedFailed({ err: error }));
				})
			))
		);

	@Effect()
	requestFileByUrl$ = this.actions$
		.pipe(
			ofType<FileRequestedByURL>(FileUploadActionTypes.FileRequestedByURL),
			switchMap((action) => this.fileUploadService.getFileByURL(action.payload.url).pipe(
				map(res => {
					return new FileRequestedSucceed({ data: res });
				}), catchError(error => {
					return of(new FileRequestedFailed({ err: error }));
				})
			))
		);

	@Effect()
	uploadHumanityFile$ = this.actions$
		.pipe(
			ofType<HumanityFileOnServerUploaded>(FileUploadActionTypes.HumanityFileOnServerUploaded),
			switchMap((action) =>
				this.fileUploadService.uploadHumanityFile(action.payload.humanityId, action.payload.documentType, action.payload.files)
					.pipe(
						map(res => {
							return new HumanityFileUploaded({ files: res });
						}), catchError(error => {
							return of(new HumanityFileError({ err: error }));
						})
					))
		);

	@Effect()
	loadHumanityFile$ = this.actions$
		.pipe(
			ofType<HumanityFileRequested>(FileUploadActionTypes.HumanityFileRequested),
			switchMap((action) => this.fileUploadService.getHumanityFiles(action.payload.documentType, action.payload.humanityId).pipe(
				map(res => {
					return new HumanityFileRequestedSucceed({ humanityFileList: res });
				}), catchError(error => {
					return of(new HumanityFileError({ err: error }));
				})
			))
		);

	@Effect()
	humanityUploadMultiple$ = this.actions$
		.pipe(
			ofType<HumanityFileOnServerMultipleUploaded>(FileUploadActionTypes.HumanityFileOnServerMultipleUploaded),
			// switchMap((action) => this.fileUploadService.uploadMultipleHumanityFile(action.payload.documentType, action.payload.files).pipe(
			switchMap((action) => this.fileUploadService.uploadMultipleHumanityFile(action.payload.documentType, action.payload.files).pipe(
				// switchMap((action) => this.fileUploadService.uploadMultipleHumanityFile(action.payload.files).pipe(
				map(res => {
					return new HumanityFileUploaded({ files: res });
				}), catchError(error => {
					return of(new FileRequestedFailed({ err: error }));
				})
			))
		);

	@Effect()
	humanityDeleteTemp$ = this.actions$
		.pipe(
			ofType<DeleteFileTempRequested>(FileUploadActionTypes.DeleteFileTempRequested),
			// switchMap((action) => this.fileUploadService.uploadMultipleHumanityFile(action.payload.documentType, action.payload.files).pipe(
			switchMap((action) => this.fileUploadService.deleteFileTemp(action.payload.listLink).pipe(
				// switchMap((action) => this.fileUploadService.uploadMultipleHumanityFile(action.payload.files).pipe(
				map(res => {
					return new DeleteFileTempSucceed({ isDeleteTemp: true });
				}), catchError(error => {
					return of(new DeleteFileFailed({ err: error }));
				})
			))
		);

	@Effect()
	deleteFileById$ = this.actions$
		.pipe(
			ofType<DeleteFileRequested>(FileUploadActionTypes.DeleteFileRequested),
			// switchMap((action) => this.fileUploadService.uploadMultipleHumanityFile(action.payload.documentType, action.payload.files).pipe(
			mergeMap((action) => this.fileUploadService.deleteFileById(action.payload.fileId).pipe(
				// switchMap((action) => this.fileUploadService.uploadMultipleHumanityFile(action.payload.files).pipe(
				map(res => {
					return new DeleteFileSucceed();
				}), catchError(error => {
					return of(new DeleteFileFailed({ err: error }));
				})
			))
		);

	@Effect()
	uploadAvatarCampaign$ = this.actions$
		.pipe(
			ofType<UploadAvatarCampaign>(FileUploadActionTypes.UploadAvatarCampaign),
			switchMap((action) => this.fileUploadService.uploadImageCampaign(action.payload.body).pipe(
				map(res => {
					return new UploadAvatarCampaignSucceed({ result: res });
				}), catchError(error => {
					return of(new UploadAvatarCampaignFailed({ err: error }));
				})
			))
		);

	@Effect()
	campaignUpload$ = this.actions$
		.pipe(
			ofType<CampaignUpload>(FileUploadActionTypes.CampaignUpload),
			switchMap((action) =>
				this.fileUploadService.campaigUpload(action.payload.campaignId, action.payload.documentType, action.payload.files)
					.pipe(
						map(res => {
							return new CampaignUploadSuccess({ files: res });
						}), catchError(error => {
							return of(new CampaignUploadError({ err: error }));
						})
					))
		);
	@Effect()
	campaignUploadMuti$ = this.actions$
		.pipe(
			ofType<CampaignUploadMutil>(FileUploadActionTypes.CampaignUploadMutil),
			switchMap((action) => this.fileUploadService.campaigUploadMutil(action.payload.documentType, action.payload.files).pipe(
				map(res => {
					return new CampaignUploadMutilSuccess({ files: res });
				}), catchError(error => {
					return of(new CampaignUploadMutilError({ err: error }));
				})
			))
		);

	@Effect()
	campaignContentUpload$ = this.actions$
		.pipe(
			ofType<CampaignContentUpload>(FileUploadActionTypes.CampaignContentUpload),
			switchMap((action) => this.fileUploadService.campaignContentUpload(action.payload.body).pipe(
				map(res => {
					return new CampaignContentUploadSuccess({ result: res });
				}), catchError(error => {
					return of(new CampaignContentUploadError({ err: error }));
				})
			))
		);
	constructor(
		private actions$: Actions,
		private fileUploadService: FileUploadService,
		private layoutUtilsService: LayoutUtilsService) {

	}


}
