import { from } from 'rxjs';

// Context
export { CampaignDataContext } from './_server/_campaign.data-context';
export { DcndDataContext } from './_server/_dcnd.data-context';
export { DonateDataContext } from './_server/_donate.data-context';
// Services
export {
	CampaignsService,
	DcndsService,
	DonatesService,
	UserProfileService,
	AddressService,
	FileUploadService,
	UserSpamService
} from './_services';
// DataSources
export { CampaignsDataSource } from './_data-sources/campaigns.datasource';
export { DcndsDataSource } from './_data-sources/dcnds.datasource';
export { DonatesDataSource } from './_data-sources/donates.datasource';
export { UserSpamDataSource } from './_data-sources/user-spam.datasource';

// Actions
export {
	UserProfileRequested,
	UserProfileLoaded,
	UserProfileUpdateOnServer,
	UserProfileUpdated,
	UsersProfileActionToggleLoading,
	ChangePasswordFailed,
	ChangePasswordOnServer,
	ChangePasswordSucceed,
	UserProfileCatchError,
	ResetChangePasswordResult,
	ResetUpdateProfileResult
} from './_actions/user-profile.actions';
export {
	ProvinceRequested,
	ProvinceLoaded,
	DistrictRequested,
	DistrictRequestedSuccess,
	WardRequested,
	WardRequestedSuccess,
	AddressRequestedFailed
} from './_actions/address.actions';
export {
	FileUploadRequested,
	FileUploadSucceed,
	FileUploadFailed,
	FileRequestedByURL,
	FileRequestedById,
	FileRequestedSucceed,
	HumanityFileOnServerUploaded,
	HumanityFileRequested,
	HumanityFileOnServerMultipleUploaded,
	DeleteFileTempRequested,
	DeleteFileRequested,
	CleanStore
} from './_actions/file-upload.actions';

// Campaign Actions =>
export {
	CampaignActionTypes,
	CampaignActions,
	CampaignsPageRequested,
	CampaignsPageLoaded,
	CampaignDeleted,
	CampaignEdited,
	CampaignCreated,
	CampaignStatus,
	CampaignStatusError,
	CampaignStatusSuccess,
	CampaignCreateError,
	CampaignCreateSuccess,
	CampaignDeleteError,
	CampaignDeleteSuccess,
	CampaignEditError,
	CampaignEditSuccess
} from './_actions/campaign.actions';

export {
	DcndActionTypes,
	DcndActions,
	DcndsPageRequested,
	DcndsPageLoaded,
	DcndUpdated,
	DcndOnServerUpdateError,
	DcndOnServerUpdateSuccess,
	DcndDeleted,
	DcndOnServerDeleteError,
	DcndOnServerDeleteSuccess
} from './_actions/dcnd.actions';
export {
	DcndOnServerCreated,
	DcndLoadRequested,
	DcndOnServerUpdated,
	DcndIndexViewRequested
} from './_actions/dcnd-edit.actions';
export {
	DonateActionTypes,
	DonateActions,
	DonateApprove,
	DonateApproveError,
	DonateApproveSuccess,
	DonateReject,
	DonateRejectError,
	DonateRejectSuccess,
	DonateSpam,
	DonateSpamError,
	DonateSpamSuccess,
	DonatesPageLoaded,
	DonateViewLoad,
	DonatesPageRequested,
	DonatesActionToggleLoading,
	DonatesPageToggleLoading
} from './_actions/donate.actions';

export {
	UserSpamActionTypes,
	UserSpamActions,
	UserSpamsPageRequested,
	UserSpamsPageLoaded,
	UserSpamUpdated,
	UserSpamOnServerUpdateError,
	UserSpamOnServerUpdateSuccess,
} from './_actions/user-spam.actions';

export { DialogConfirmed, DialogClosed } from './_actions/dialog.actions';
// Effects
export { CampaignEffects } from './_effects/campaign.effects';
export { DcndEffects } from './_effects/dcnd.effects';
export { DcndEditEffects } from './_effects/dcnd-edit.effects';
export { UserProfileEffects } from './_effects/user-profile.effects';
export { AddressEffects } from './_effects/address.effects';
export { FileUploadEffects } from './_effects/file-upload.effects';
export { DonateEffects } from './_effects/donate.effects';
export { UserSpamEffects } from './_effects/user-spam.effects';
// Reducers
export { campaignsReducer } from './_reducers/campaign.reducers';
export { dcndsReducer } from './_reducers/dcnd.reducers';
export { dcndsEditReducer } from './_reducers/dcnd-edit.reducers';
export { UserProfileReducer } from './_reducers/user-profile.reducers';
export { AddressReducer } from './_reducers/address.reducers';
export { FileUploadReducer } from './_reducers/file-upload.reducers';
export { DonatesState } from './_reducers/donate.reducers';
export { UserSpamsReducer } from './_reducers/user-spam.reducers';
export { diaglogReducer } from './_reducers/dialog.reducers';

// Selectors
export {
	isUserProfileLoaded,
	currentUserProfile,
	isUserUpdated,
	isUserProfileError,
	isChangePasswordSucceed,
	passwordChangeSuccess,
	passwordChangeFailed
} from './_selectors/user-profile.selectors';

export {
	currentProvince,
	currentDistrict,
	currentWard,
	isProviceLoad,
	selectAddressError
} from './_selectors/address.selectors';

export {
	isFileUploaded,
	currentfile,
	fileUploadError,
	currentfileData,
	currentHumanityFile,
	currentHumanityRequestError,
	isHumanityFileUpload,
	selectHumanityUploaded,
	selectFileUploadError,
	selectFileDeletedErr,
	isFileDeleted
} from './_selectors/file-upload.selectors';
// Campaign selectors =>
export {
	selectCampaignById,
	selectCampaignsInStore,
	selectCampaignsPageLoading,
	selectCampaignsActionLoading,
	selectCampaignsShowInitWaitingMessage,
	selectCampaignsUpdateError,
	selectCampaignsUpdateSuccess,
	selectCampaignDeleteError,
	selectCampaignDeleteSuccess,
	selectCampaignEditError,
	selectCampaignEditSuccess,
	selectCampaignCreateError,
	selectCampaignCreateSuccess
} from './_selectors/campaign.selectors';

export {
	selectDcndById,
	selectDcndsInStore,
	selectDcndsPageLoading,
	selectDcndsActionLoading,
	selectDcndsShowInitWaitingMessage,
	selectUpdateError,
	selectUpdateSuccess,
	selectDeleteError,
	selectDeleteSuccess,
	selectAllDcnds
} from './_selectors/dcnd.selectors';

export {
	isDcndCreated,
	selectDcndRequestedError,
	selectCurrentDcnd,
	selectDcndLoadedError,
	isDcndUpdated
} from './_selectors/dcnd-edit.selectors';

export {
	selectDonateApproveError,
	selectDonateApproveSuccess,
	selectDonateById,
	selectDonateRejectError,
	selectDonateRejectSuccess,
	selectDonateSpamError,
	selectDonateSpamSuccess,
	selectDonatesActionLoading,
	selectDonatesInStore,
	selectDonatesPageLastQuery,
	selectDonatesPageLoading,
	selectDonatesShowInitWaitingMessage,
	selectDonatesState,
	selectHasDonatesInStore,
	selectViewDonateId
} from './_selectors/donate.selectors';

export {
	selectUserSpamsPageLoading,
	selectAllUserSpams,
	selectHasUserSpamsInStore,
	selectUserSpamById,
	selectUserSpamUpdateError,
	selectUserSpamUpdateSuccess,
	selectUserSpamsActionLoading,
	selectUserSpamsInStore,
	selectUserSpamsPageLastQuery,
	selectUserSpamsShowInitWaitingMessage,
	selectUserSpamsState
} from './_selectors/user-spam.selectors';

export { isDialogConfirmed } from './_selectors/dialog.selectors';
// Models
export { Campaign, CampaignsDelete, CampaignsChangeStatus, CampaignsEdit, CampaignSearchDcnds } from './_models/campaign.model';
export { UserProfile, ReferenceLink } from './_models/user-profile.model';
export { Province, District, Ward, } from './_models/address.model';
export { ChangePassword } from './_models/change-password.model';
export { ErrorResponse } from './_models/error.model';
export { FileUpload, HumanityFileUpload, HumanityFile, CampaignFileUpload, CampaignFile } from './_models/file-upload.model';
export { Dcnd, DcndDelete, DcndUpdate, DcndEdit, DcndIndexView } from './_models/dcnd.model';
export { Donate, DonatesStatus, ViewDonate } from './_models/donate.model';
export { UserSpamModel,UserSpamUpdateModel } from './_models/user-spam.model';
