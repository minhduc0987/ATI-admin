// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { UserSpamModel, UserSpamUpdateModel } from '../_models/user-spam.model';
// Models
import { QueryParamsModel } from '../../_base/crud';
import { HttpErrorResponse } from '@angular/common/http';

export enum UserSpamActionTypes {
	AllUserSpamsRequested = '[User Spam Module] All User Spam Requested',
	UserSpamUpdated = '[User Spam] User Spam Updated',
	UserSpamsPageRequested = '[User Spam List Page] User Spam Page Requested',
	UserSpamsPageLoaded = '[User Spam API] User Spam Page Loaded',
	UserSpamsPageToggleLoading = '[User Spam] User Spam Page Toggle Loading',
	UserSpamOnServerUpdateSuccess = '[User Spam] User Spam Update Success',
	UserSpamOnServerUpdateError = '[User Spam] User Spam Update Error',
	UserSpamsActionToggleLoading = '[User Spam] User Spam Action Toggle Loading',
	UserSpamDeleted = '[User Spam] User Spam Deleted',
	UserSpamOnServerDeleteSuccess = '[User Spam] User Spam Delete Success',
	UserSpamOnServerDeleteError = '[User Spam] User Spam Delete Error',

	UserSpamError = '[User Spam] User Spam Requested Error'
}

export class UserSpamUpdated implements Action {
	readonly type = UserSpamActionTypes.UserSpamUpdated;
	constructor(public payload: { userSpamUpdate: UserSpamUpdateModel }) { }
}

export class UserSpamsPageRequested implements Action {
	readonly type = UserSpamActionTypes.UserSpamsPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class UserSpamsPageLoaded implements Action {
	readonly type = UserSpamActionTypes.UserSpamsPageLoaded;
	constructor(
		public payload: {
			userSpam: UserSpamModel[];
			totalCount: number;
			page: QueryParamsModel;
		}
	) { }
}

export class UserSpamsPageToggleLoading implements Action {
	readonly type = UserSpamActionTypes.UserSpamsPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class UserSpamsActionToggleLoading implements Action {
	readonly type = UserSpamActionTypes.UserSpamsActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class UserSpamOnServerUpdateError implements Action {
	readonly type = UserSpamActionTypes.UserSpamOnServerUpdateError;
	constructor(public payload: { err: any }) { }
}

export class UserSpamOnServerUpdateSuccess implements Action {
	readonly type = UserSpamActionTypes.UserSpamOnServerUpdateSuccess;
}


export class UserSpamErr implements Action {
	readonly type = UserSpamActionTypes.UserSpamError;
	constructor(public payload: { error: HttpErrorResponse }) { }
}

export type UserSpamActions =
	| UserSpamUpdated
	| UserSpamsPageLoaded
	| UserSpamsPageToggleLoading
	| UserSpamsPageRequested
	| UserSpamsActionToggleLoading
	| UserSpamOnServerUpdateError
	| UserSpamOnServerUpdateSuccess
	| UserSpamErr;

