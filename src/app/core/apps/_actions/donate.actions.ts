// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { Donate, ViewDonate } from '../_models/donate.model';
// Models
import { QueryParamsModel } from '../../_base/crud';
import { HttpErrorResponse } from '@angular/common/http';

export enum DonateActionTypes {
	AllDonatesRequested = '[Donates Module] All Donates Requested',
	AllDonatesLoaded = '[Donates API] All Donates Loaded',
	DonatesPageRequested = '[Donates List Page] Donates Page Requested',
	DonatesPageLoaded = '[Donates API] Donates Page Loaded',
	DonatesPageToggleLoading = '[Donates] Donates Page Toggle Loading',
	DonatesActionToggleLoading = '[Donates] Donates Action Toggle Loading',
	DonateSpam = '[Donates] Donate Spam',
	DonateSpamError = '[Donates] Donate Spam Error',
	DonateSpamSuccess = '[Donates] Donate Spam Success',
	DonateApprove = '[Donates] Donate Approve',
	DonateApproveError = '[Donates] Donate Approve Error',
	DonateApproveSuccess = '[Donates] Donate Approve Success',
	DonateReject = '[Donates] Donate R',
	DonateRejectError = '[Donates] Donate R Error',
	DonateRejectSuccess = '[Donates] Donate R Success',
	DonateViewLoad = '[Donates] Donate View Load',
	DonateViewLoadSuccess = '[Donates] Donate View Load Success',
}

export class DonateSpam implements Action {
	readonly type = DonateActionTypes.DonateSpam;
	constructor(public payload: { id: any }) {}
}

export class DonateSpamError implements Action {
	readonly type = DonateActionTypes.DonateSpamError;
	constructor(public payload: { err: any }) { }
}

export class DonateSpamSuccess implements Action {
	readonly type = DonateActionTypes.DonateSpamSuccess;
	constructor(public payload: { id: any }) { }
}

export class DonateReject implements Action {
	readonly type = DonateActionTypes.DonateReject;
	constructor(public payload: { id: any }) {}
}

export class DonateRejectError implements Action {
	readonly type = DonateActionTypes.DonateRejectError;
	constructor(public payload: { err: any }) { }
}

export class DonateRejectSuccess implements Action {
	readonly type = DonateActionTypes.DonateRejectSuccess;
	constructor(public payload: { id: any }) { }
}

export class DonateApprove implements Action {
	readonly type = DonateActionTypes.DonateApprove;
	constructor(public payload: { id: any }) {}
}

export class DonateApproveError implements Action {
	readonly type = DonateActionTypes.DonateApproveError;
	constructor(public payload: { err: any }) { }
}

export class DonateApproveSuccess implements Action {
	readonly type = DonateActionTypes.DonateApproveSuccess;
	constructor(public payload: { id: any }) { }
}

export class DonatesPageRequested implements Action {
	readonly type = DonateActionTypes.DonatesPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class DonatesPageLoaded implements Action {
	readonly type = DonateActionTypes.DonatesPageLoaded;
	constructor(
		public payload: {
			donates: Donate[];
			totalCount: number;
			page: QueryParamsModel;
		}
	) { }
}

export class DonatesPageToggleLoading implements Action {
	readonly type = DonateActionTypes.DonatesPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class DonatesActionToggleLoading implements Action {
	readonly type = DonateActionTypes.DonatesActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class DonateViewLoad implements Action {
	readonly type = DonateActionTypes.DonateViewLoad;
	constructor(public payload: { id: any }) { }
}

export class DonateViewLoadSuccess implements Action {
	readonly type = DonateActionTypes.DonateViewLoadSuccess;
	constructor(public payload: {
			donateData: ViewDonate[];
	 }) { }
}

export type DonateActions =
	| DonatesPageLoaded
	| DonatesPageToggleLoading
	| DonatesPageRequested
	| DonatesActionToggleLoading
	| DonateReject
	| DonateRejectError
	| DonateRejectSuccess
	| DonateSpam
	| DonateSpamError
	| DonateSpamSuccess
	| DonateApprove
	| DonateApproveError
	| DonateApproveSuccess
	| DonateViewLoad
	| DonateViewLoadSuccess;
