// Actions
import { FileUploadActionTypes, FileUploadActions, HumanityFileOnServerMultipleUploaded } from '../_actions/file-upload.actions';
// Models
import { FileUpload, HumanityFileUpload, HumanityFile } from '../_models/file-upload.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface FileUploadState {
	fileDesc: FileUpload;
	_isFileUploaded: boolean;
	_isError: any;
	uploadError: any;
	errorMess: HttpErrorResponse;
	data: any;
	_isFileRequested: boolean;
	_isDeleteTemp: boolean;

	humanityFileError: HttpErrorResponse;
	_isHumanityFileUploaded: boolean;
	humanityFiles: HumanityFile[];
	listFileUploaded: HumanityFileUpload;

	_isFileDeleted: boolean;
	deleteFileErr: HttpErrorResponse;

	avatarCampaigSuccess: boolean;
	avatarCampaignError: any;

	listFileCampaignUploaded: HumanityFileUpload;
	_isFileCampaignUploaded: boolean;
	campaignFileError: HttpErrorResponse;

	_isCampaignContentUploaded: boolean;
	fileContentCampaignDesc: any;
	uploadContentCampaignError: any;

}


export const initialFileUploadState: FileUploadState = {
	fileDesc: null,
	_isFileUploaded: false,
	_isError: null,
	uploadError: null,
	data: null,
	_isFileRequested: false,
	errorMess: null,
	_isHumanityFileUploaded: false,
	humanityFiles: null,
	humanityFileError: null,
	listFileUploaded: null,
	_isDeleteTemp: false,
	_isFileDeleted: false,
	deleteFileErr: null,
	avatarCampaigSuccess: false,
	avatarCampaignError: null,
	listFileCampaignUploaded: null,
	_isFileCampaignUploaded: false,
	campaignFileError: null,
	_isCampaignContentUploaded: false,
	fileContentCampaignDesc: null,
	uploadContentCampaignError: null
};


export function FileUploadReducer(state = initialFileUploadState, action: FileUploadActions): FileUploadState {
	switch (action.type) {
		case FileUploadActionTypes.FileUploadRequested:
			return {
				...state,
				fileDesc: undefined,
				_isFileUploaded: false,
				_isError: undefined,
				uploadError: undefined,
				data: undefined,
				_isFileRequested: false,
				errorMess: undefined
			};
		case FileUploadActionTypes.FileUploadSucceed:
			return {
				...state,
				fileDesc: action.payload.result,
				_isFileUploaded: true
			};

		case FileUploadActionTypes.FileUploadFailed:
			return {
				...state,
				_isFileUploaded: false,
				_isError: true,
				uploadError: action.payload.err
			};

		case FileUploadActionTypes.FileRequestedSucceed:
			return {
				...state,
				_isFileRequested: true,
				data: action.payload.data
			};
		case FileUploadActionTypes.FileRequestedFailed:
			return {
				...state,
				_isFileRequested: false,
				errorMess: action.payload.err
			};
		case FileUploadActionTypes.HumanityFileRequested:
			return {
				...state,
				humanityFiles: null,
				humanityFileError: null
			};
		case FileUploadActionTypes.HumanityFileRequestedSucceed:
			return {
				...state,
				humanityFiles: action.payload.humanityFileList
			};
		case FileUploadActionTypes.HumanityFileOnServerUploaded:
			return {
				...state,
				_isHumanityFileUploaded: false,
				humanityFileError: null,
				listFileUploaded: null
			};
		case FileUploadActionTypes.HumanityFileUploaded:
			return {
				...state,
				_isHumanityFileUploaded: true,
				listFileUploaded: action.payload.files
			};
		case FileUploadActionTypes.HumanityFileError:
			return {
				...state,
				humanityFileError: action.payload.err
			};
		case FileUploadActionTypes.HumanityFileOnServerMultipleUploaded:
			return {
				...state,
				listFileUploaded: null,
				humanityFileError: null,
				_isHumanityFileUploaded: false,
			};
		case FileUploadActionTypes.CleanStore:
			return {
				...state,
				fileDesc: null,
				_isFileUploaded: false,
				_isError: null,
				uploadError: null,
				data: null,
				_isFileRequested: false,
				errorMess: null,
				_isHumanityFileUploaded: false,
				humanityFiles: null,
				humanityFileError: null,
				listFileUploaded: null
			};
		case FileUploadActionTypes.DeleteFileTempRequested:
			return {
				...state,
				_isDeleteTemp: false
			};
		case FileUploadActionTypes.DeleteFileTempSucceed:
			return {
				...state,
				_isDeleteTemp: true
			};
		case FileUploadActionTypes.DeleteFileSucceed:
			return {
				...state,
				_isFileDeleted: true
			};
		case FileUploadActionTypes.DeleteFileFailed:
			return {
				...state,
				deleteFileErr: action.payload.err
			};
		case FileUploadActionTypes.UploadAvatarCampaignSucceed:
			return {
				...state,
				fileDesc: action.payload.result,
				avatarCampaigSuccess: true,
				avatarCampaignError : false
			};

		case FileUploadActionTypes.UploadAvatarCampaignFailed:
			return {
				...state,
				avatarCampaigSuccess: false,
				avatarCampaignError: action.payload.err
			};
		case FileUploadActionTypes.CampaignUploadSuccess:
			return {
				...state,
				_isFileCampaignUploaded: true,
				listFileCampaignUploaded: action.payload.files
			};
		case FileUploadActionTypes.CampaignUploadError:
			return {
				...state,
				campaignFileError: action.payload.err
			};
		case FileUploadActionTypes.CampaignUploadMutilSuccess:
			return {
				...state,
				_isFileCampaignUploaded: true,
				listFileCampaignUploaded: action.payload.files
			};
		case FileUploadActionTypes.CampaignUploadMutilError:
			return {
				...state,
				_isFileCampaignUploaded: false,
				campaignFileError: action.payload.err,
				listFileCampaignUploaded: null
			};
		case FileUploadActionTypes.CampaignContentUploadSuccess:
			return {
				...state,
				fileContentCampaignDesc: action.payload.result,
				_isCampaignContentUploaded: true
			};

		case FileUploadActionTypes.CampaignContentUploadError:
			return {
				...state,
				_isCampaignContentUploaded: false,
				uploadContentCampaignError: action.payload.err
			};
		default:
			return state;
	}
}

