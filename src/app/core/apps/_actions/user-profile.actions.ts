// NGRX
import { Action } from '@ngrx/store';
// CRUD
import { UserProfile } from '../_models/user-profile.model';
import { ChangePassword } from '../_models/change-password.model';
// Models

export enum UserProfileActionTypes {
	UserProfileUpdateOnServer = '[Update User Profile] Update User Profile On Server',
	UserProfileUpdated = '[Update User Profile] User Profile Updated ',
	UserProfileRequested = '[User Profile] User Profile Requested ',
	UserProfileLoaded = '[User Profile] User Profile Loaded ',
	UsersProfileActionToggleLoading = '[Users Profile] Users Profile Action Toggle Loading',
	UserProfileCatchError = '[User Profile] HTTP Request Error',
	ChangePasswordOnServer = '[Password] Change Password',
	ChangePasswordSucceed = '[Password] Change Password Succeed',
	ChangePasswordFailed = '[Password] Change Password Failed',
	ResetChangePasswordResult = '[Reset] Change Password Result',
	ResetUpdateProfileResult = '[Reset] Update Profile Result',
}

export class UserProfileUpdateOnServer implements Action {
	readonly type = UserProfileActionTypes.UserProfileUpdateOnServer;
	constructor(public payload: { userProfile: UserProfile }) { }
}

export class UserProfileUpdated implements Action {
	readonly type = UserProfileActionTypes.UserProfileUpdated;
	constructor(public payload: { userProfile: UserProfile }) { }
}

export class UserProfileRequested implements Action {
	readonly type = UserProfileActionTypes.UserProfileRequested;
}

export class UserProfileLoaded implements Action {
	readonly type = UserProfileActionTypes.UserProfileLoaded;
	constructor(public payload: { userProfile: UserProfile }) { }
}

export class UsersProfileActionToggleLoading implements Action {
	readonly type = UserProfileActionTypes.UsersProfileActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class UserProfileCatchError implements Action {
	readonly type = UserProfileActionTypes.UserProfileCatchError;
	constructor(public payload: { isError: any }) { }
}

export class ChangePasswordOnServer implements Action {
	readonly type = UserProfileActionTypes.ChangePasswordOnServer;
	constructor(public payload: { passwordObj: ChangePassword }) { }
}

export class ChangePasswordSucceed implements Action {
	readonly type = UserProfileActionTypes.ChangePasswordSucceed;
	constructor(public payload: { result: any }) { }
}

export class ChangePasswordFailed implements Action {
	readonly type = UserProfileActionTypes.ChangePasswordFailed;
	constructor(public payload: { result: any }) { }
}

export class ResetChangePasswordResult implements Action {
	readonly type = UserProfileActionTypes.ResetChangePasswordResult;
}

export class ResetUpdateProfileResult implements Action {
	readonly type = UserProfileActionTypes.ResetUpdateProfileResult;
}

export type UserProfileActions = UserProfileRequested
	| UserProfileLoaded
	| UserProfileUpdateOnServer
	| UserProfileUpdated
	| UsersProfileActionToggleLoading
	| UserProfileCatchError
	| ChangePasswordOnServer
	| ChangePasswordSucceed
	| ChangePasswordFailed
	| ResetChangePasswordResult
	| ResetUpdateProfileResult;
