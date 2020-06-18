// NGRX
import { Action } from '@ngrx/store';
import { FileUpload, HumanityFileUpload, HumanityFile } from '../_models/file-upload.model';
import { HttpErrorResponse } from '@angular/common/http';

export enum FileUploadActionTypes {
	FileUploadRequested = '[Upload] File Upload Requested',
	FileUploadSucceed = '[Upload] File Upload Succeed',
	FileUploadFailed = '[Upload] File Upload Failed',
	FileRequestedById = '[File] File Requested By Id',
	FileRequestedByURL = '[File] File Requested By Url',
	FileRequestedSucceed = '[File] File Requested Succeed',
	FileRequestedFailed = '[File] File Requested Failed',

	HumanityFileRequested = '[File] Humanity File Requested',
	HumanityFileRequestedSucceed = '[File] Humanity File Requested Succeed',
	HumanityFileOnServerUploaded = '[File] Humanity File On Server Uploaded',
	HumanityFileUploaded = '[File] Humanity File Uploaded Succeed',
	HumanityFileError = '[File] Humanity File Requested Error',
	HumanityFileOnServerMultipleUploaded = '[File] Humanity File On Server Multiple Uploaded',

	DeleteFileRequested = '[File] Delete File Requested',
	DeleteFileSucceed = '[File] Delete File Succeed',
	DeleteFileFailed = '[File] Delete File Failed',

	DeleteFileTempRequested = '[File] Delete File Temp Requested',
	DeleteFileTempSucceed = '[File] Delete File Temp Succeed',
	CleanStore = '[File] Clean Storage',

	UploadAvatarCampaign = '[Upload] Upload Avatar Campaign',
	UploadAvatarCampaignSucceed = '[Upload] Upload Avatar Campaign Succeed',
	UploadAvatarCampaignFailed = '[Upload] Upload Avatar Campaign Failed',

	CampaignUploadSuccess = '[File] Campaign File Uploaded Succeed',
	CampaignUploadError = '[File] Campaign File Requested Error',
	CampaignUpload = '[File] Campaign Upload',

	CampaignUploadMutilSuccess = '[File] Campaign Mutil File Uploaded Succeed',
	CampaignUploadMutilError = '[File] Campaign Mutil File Requested Error',
	CampaignUploadMutil = '[File] Campaign Mutil Upload',

	CampaignContentUpload = '[Upload] Campaign Content Upload',
	CampaignContentUploadSuccess = '[Upload] Campaign Content Upload Success',
	CampaignContentUploadError = '[Upload] Campaign Content Upload Error',
}

export class FileUploadRequested implements Action {
	readonly type = FileUploadActionTypes.FileUploadRequested;
	// constructor(public payload: { type: string, body: FormData }) { }
	constructor(public payload: { body: FormData }) { }
}

export class FileUploadSucceed implements Action {
	readonly type = FileUploadActionTypes.FileUploadSucceed;
	constructor(public payload: { result: FileUpload }) { }
}

export class FileUploadFailed implements Action {
	readonly type = FileUploadActionTypes.FileUploadFailed;
	constructor(public payload: { err: any }) { }
}

export class FileRequestedById implements Action {
	readonly type = FileUploadActionTypes.FileRequestedById;
	constructor(public payload: { id: number }) { }
}

export class FileRequestedByURL implements Action {
	readonly type = FileUploadActionTypes.FileRequestedByURL;
	constructor(public payload: { url: string }) { }
}

export class FileRequestedSucceed implements Action {
	readonly type = FileUploadActionTypes.FileRequestedSucceed;
	constructor(public payload: { data: any }) { }
}

export class FileRequestedFailed implements Action {
	readonly type = FileUploadActionTypes.FileRequestedFailed;
	constructor(public payload: { err: any }) { }
}

export class HumanityFileRequested implements Action {
	readonly type = FileUploadActionTypes.HumanityFileRequested;
	constructor(public payload: { documentType: string, humanityId: number }) { }
}

export class HumanityFileRequestedSucceed implements Action {
	readonly type = FileUploadActionTypes.HumanityFileRequestedSucceed;
	constructor(public payload: { humanityFileList: HumanityFile[] }) { }
}

export class HumanityFileError implements Action {
	readonly type = FileUploadActionTypes.HumanityFileError;
	constructor(public payload: { err: HttpErrorResponse }) { }
}

export class HumanityFileOnServerUploaded implements Action {
	readonly type = FileUploadActionTypes.HumanityFileOnServerUploaded;
	constructor(public payload: { humanityId: number, documentType: string, files: FormData[] }) { }
}

export class HumanityFileUploaded implements Action {
	readonly type = FileUploadActionTypes.HumanityFileUploaded;
	constructor(public payload: { files: HumanityFileUpload }) { }
}

export class HumanityFileOnServerMultipleUploaded implements Action {
	readonly type = FileUploadActionTypes.HumanityFileOnServerMultipleUploaded;
	constructor(public payload: { documentType: string, files: FormData }) { }
	// constructor(public payload: { documentType: string, files: FormData[] }) { }
	// constructor(public payload: { files: FormData[] }) { }
}

export class DeleteFileRequested implements Action {
	readonly type = FileUploadActionTypes.DeleteFileRequested;
	constructor(public payload: { fileId: number }) { }
}

export class DeleteFileSucceed implements Action {
	readonly type = FileUploadActionTypes.DeleteFileSucceed;
}

export class DeleteFileFailed implements Action {
	readonly type = FileUploadActionTypes.DeleteFileFailed;
	constructor(public payload: { err: HttpErrorResponse }) { }
}

export class DeleteFileTempRequested implements Action {
	readonly type = FileUploadActionTypes.DeleteFileTempRequested;
	constructor(public payload: { listLink: string[] }) { }
}

export class DeleteFileTempSucceed implements Action {
	readonly type = FileUploadActionTypes.DeleteFileTempSucceed;
	constructor(public payload: { isDeleteTemp: boolean }) { }
}

export class CleanStore implements Action {
	readonly type = FileUploadActionTypes.CleanStore;
}

export class UploadAvatarCampaign implements Action {
	readonly type = FileUploadActionTypes.UploadAvatarCampaign;
	constructor(public payload: { body: FormData }) { }
}

export class UploadAvatarCampaignSucceed implements Action {
	readonly type = FileUploadActionTypes.UploadAvatarCampaignSucceed;
	constructor(public payload: { result: FileUpload }) { }
}

export class UploadAvatarCampaignFailed implements Action {
	readonly type = FileUploadActionTypes.UploadAvatarCampaignFailed;
	constructor(public payload: { err: any }) { }
}

export class CampaignUploadMutil implements Action {
	readonly type = FileUploadActionTypes.CampaignUploadMutil;
	constructor(public payload: { documentType: string, files: FormData }) { }
}

export class CampaignUploadMutilError implements Action {
	readonly type = FileUploadActionTypes.CampaignUploadMutilError;
	constructor(public payload: { err: HttpErrorResponse }) { }
}

export class CampaignUploadMutilSuccess implements Action {
	readonly type = FileUploadActionTypes.CampaignUploadMutilSuccess;
	constructor(public payload: { files: HumanityFileUpload }) { }
}

export class CampaignUpload implements Action {
	readonly type = FileUploadActionTypes.CampaignUpload;
	constructor(public payload: { campaignId: number, documentType: string, files: FormData[] }) { }
}

export class CampaignUploadError implements Action {
	readonly type = FileUploadActionTypes.CampaignUploadError;
	constructor(public payload: { err: HttpErrorResponse }) { }
}

export class CampaignUploadSuccess implements Action {
	readonly type = FileUploadActionTypes.CampaignUploadSuccess;
	constructor(public payload: { files: HumanityFileUpload }) { }
}

export class CampaignContentUpload implements Action {
	readonly type = FileUploadActionTypes.CampaignContentUpload;
	constructor(public payload: { body: FormData }) { }
}

export class CampaignContentUploadSuccess implements Action {
	readonly type = FileUploadActionTypes.CampaignContentUploadSuccess;
	constructor(public payload: { result: FileUpload }) { }
}

export class CampaignContentUploadError implements Action {
	readonly type = FileUploadActionTypes.CampaignContentUploadError;
	constructor(public payload: { err: any }) { }
}

export type FileUploadActions = FileUploadRequested
	| FileUploadSucceed
	| FileUploadFailed
	| FileRequestedById
	| FileRequestedByURL
	| FileRequestedSucceed
	| FileRequestedFailed
	| HumanityFileRequested
	| HumanityFileRequestedSucceed
	| HumanityFileError
	| HumanityFileOnServerUploaded
	| HumanityFileUploaded
	| HumanityFileOnServerMultipleUploaded
	| DeleteFileTempRequested
	| DeleteFileTempSucceed
	| DeleteFileRequested
	| DeleteFileSucceed
	| DeleteFileFailed
	| UploadAvatarCampaign
	| UploadAvatarCampaignSucceed
	| UploadAvatarCampaignFailed
	| CleanStore
	| CampaignUploadMutil
	| CampaignUploadMutilError
	| CampaignUploadMutilSuccess
	| CampaignUpload
	| CampaignUploadError
	| CampaignUploadSuccess
	| CampaignContentUpload
	| CampaignContentUploadError
	| CampaignContentUploadSuccess
	;
