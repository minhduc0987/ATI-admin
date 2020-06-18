// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { Dcnd, DcndEdit } from '../_models/dcnd.model';
// Models
import { QueryParamsModel } from '../../_base/crud';
import { HttpErrorResponse } from '@angular/common/http';

export enum DcndActionTypes {
	AllDcndsRequested = '[Dcnds Module] All Dcnds Requested',
	DcndUpdated = '[Dcnds] Dcnd Updated',
	DcndsPageRequested = '[Dcnds List Page] Dcnds Page Requested',
	DcndsPageLoaded = '[Dcnds API] Dcnds Page Loaded',
	DcndsPageToggleLoading = '[Dcnds] Dcnds Page Toggle Loading',
	DcndOnServerUpdateSuccess = '[Dcnds] Dcnd Update Success',
	DcndOnServerUpdateError = '[Dcnds] Dcnd Update Error',
	DcndsActionToggleLoading = '[Dcnds] Dcnds Action Toggle Loading',
	DcndDeleted = '[Dcnds] Dcnd Deleted',
	DcndOnServerDeleteSuccess = '[Dcnds] Dcnd Delete Success',
	DcndOnServerDeleteError = '[Dcnds] Dcnd Delete Error',
}

export class DcndUpdated implements Action {
	readonly type = DcndActionTypes.DcndUpdated;
	constructor(public payload: { id: any }) {}
}

export class DcndsPageRequested implements Action {
	readonly type = DcndActionTypes.DcndsPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class DcndsPageLoaded implements Action {
	readonly type = DcndActionTypes.DcndsPageLoaded;
	constructor(
		public payload: {
			dcnds: Dcnd[];
			totalCount: number;
			page: QueryParamsModel;
		}
	) { }
}

export class DcndsPageToggleLoading implements Action {
	readonly type = DcndActionTypes.DcndsPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class DcndsActionToggleLoading implements Action {
	readonly type = DcndActionTypes.DcndsActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class DcndOnServerUpdateError implements Action {
	readonly type = DcndActionTypes.DcndOnServerUpdateError;
	constructor(public payload: { err: any }) { }
}

export class DcndOnServerUpdateSuccess implements Action {
	readonly type = DcndActionTypes.DcndOnServerUpdateSuccess;
	constructor(public payload: { id: any }) { }
}

export class DcndDeleted implements Action {
	readonly type = DcndActionTypes.DcndDeleted;
	constructor(public payload: { id: any }) {}
}

export class DcndOnServerDeleteError implements Action {
	readonly type = DcndActionTypes.DcndOnServerDeleteError;
	constructor(public payload: { err: any }) { }
}

export class DcndOnServerDeleteSuccess implements Action {
	readonly type = DcndActionTypes.DcndOnServerDeleteSuccess;
	constructor(public payload: { id: any }) { }
}

export type DcndActions =
	| DcndUpdated
	| DcndsPageLoaded
	| DcndsPageToggleLoading
	| DcndsPageRequested
	| DcndsActionToggleLoading
	| DcndOnServerUpdateError
	| DcndOnServerUpdateSuccess
	| DcndDeleted
	| DcndOnServerDeleteError
	| DcndOnServerDeleteSuccess;

