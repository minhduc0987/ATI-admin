// NGRX
import { createSelector, createFeatureSelector, select } from '@ngrx/store';
// Models

import { FileUploadState } from '../_reducers/file-upload.reducers';
import { StateEnum } from '../../../shared';

export const selectFileUploadState = createFeatureSelector<FileUploadState>(StateEnum.fileUpload);


export const isFileUploaded = createSelector(
	selectFileUploadState,
	up => up._isFileUploaded
);

export const currentfile = createSelector(
	selectFileUploadState,
	up => up.fileDesc
);

export const fileUploadError = createSelector(
	selectFileUploadState,
	up => up.uploadError
);

export const currentfileData = createSelector(
	selectFileUploadState,
	up => up.data
);

export const currentHumanityFile = createSelector(
	selectFileUploadState,
	up => up.humanityFiles
);

export const isHumanityFileUpload = createSelector(
	selectFileUploadState,
	up => up._isHumanityFileUploaded
);

export const currentHumanityRequestError = createSelector(
	selectFileUploadState,
	up => up.humanityFileError
);

export const selectHumanityUploaded = createSelector(
	selectFileUploadState,
	up => up.listFileUploaded
);

export const selectFileUploadError = createSelector(
	selectFileUploadState,
	up => up.errorMess
);


export const isFileDeleted = createSelector(
	selectFileUploadState,
	up => up._isFileDeleted
);

export const selectFileDeletedErr = createSelector(
	selectFileUploadState,
	up => up.deleteFileErr
);

export const isDeleteFileTempSucceed = createSelector(
	selectFileUploadState,
	up => up._isDeleteTemp
);

export const selectAvatarCampaign = createSelector(
	selectFileUploadState,
	up => up._isFileUploaded
);

export const selectAvatarCampaignSuccess = createSelector(
	selectFileUploadState,
	up => up.fileDesc
);

export const selectAvatarCampaignError = createSelector(
	selectFileUploadState,
	up => up.avatarCampaignError
);

export const selectCampaignUpload = createSelector(
	selectFileUploadState,
	up => up.listFileCampaignUploaded
);

export const selectCampaignUploadError = createSelector(
	selectFileUploadState,
	up => up.campaignFileError
);

export const selectCampaignContentUpload = createSelector(
	selectFileUploadState,
	up => up.fileContentCampaignDesc
);

export const selectCampaignContentUploadError = createSelector(
	selectFileUploadState,
	up => up.uploadContentCampaignError
);

