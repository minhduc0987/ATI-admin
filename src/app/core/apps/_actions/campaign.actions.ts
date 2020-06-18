// NGRX
import { Action } from '@ngrx/store';
// CRUD
import { Campaign, CampaignsEdit, CampaignSearchDcnds } from '../_models/campaign.model';
// Models
import { QueryParamsModel } from '../../_base/crud';
import { HttpErrorResponse } from '@angular/common/http';
import { Dcnd } from '../_models/dcnd.model';

export enum CampaignActionTypes {
	AllCampaignsRequested = '[Campaigns Module] All Campaigns Requested',
	AllCampaignsLoaded = '[Campaigns API] All Campaigns Loaded',
	CampaignStatus = '[Campaigns] Campaign ChangeStatus',
	CampaignsPageRequested = '[Campaigns List Page] Campaigns Page Requested',
	CampaignsPageLoaded = '[Campaigns API] Campaigns Page Loaded',
	CampaignsPageToggleLoading = '[Campaigns] Campaigns Page Toggle Loading',
	CampaignStatusSuccess = '[Campaigns] Campaign ChangeStatus Success',
	CampaignStatusError = '[Campaigns] Campaign ChangeStatus Error',
	CampaignsActionToggleLoading = '[Campaigns] Campaigns Action Toggle Loading',
	CampaignDeleted = '[Campaigns] Campaign Deleted',
	CampaignDeleteSuccess = '[Campaigns] Campaign Delete Success',
	CampaignDeleteError = '[Campaigns] Campaign Delete Error',
	CampaignEditSuccess = '[Campaigns] Campaign Edit Success',
	CampaignEditError = '[Campaigns] Campaign Edit Error',
	CampaignEdited = '[Campaigns] Campaign Edited',
	CampaignCreateSuccess = '[Campaigns] Campaign Create Success',
	CampaignCreateError = '[Campaigns] Campaign Create Error',
	CampaignCreated = '[Campaigns] Campaign Createtd',
	CampaignLoadDcnds = '[Campaigns] Campaign Load Dcnds',
	CampaignLoadDcndsSuccess = '[Campaigns] Campaign Load Dcnds Success',
	CampaignLoadCurentDcnds = '[Campaigns] Campaign Load Curent Dcnds',
	CampaignLoadCurentDcndsSuccess = '[Campaigns] Campaign Load Curent Dcnds Success',
}

export class CampaignStatus implements Action {
	readonly type = CampaignActionTypes.CampaignStatus;
	constructor(public payload: { id: any }) {}
}

export class CampaignsPageRequested implements Action {
	readonly type = CampaignActionTypes.CampaignsPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class CampaignsPageLoaded implements Action {
	readonly type = CampaignActionTypes.CampaignsPageLoaded;
	constructor(
		public payload: {
			campaigns: Campaign[];
			totalCount: number;
			page: QueryParamsModel;
		}
	) { }
}

export class CampaignsPageToggleLoading implements Action {
	readonly type = CampaignActionTypes.CampaignsPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class CampaignsActionToggleLoading implements Action {
	readonly type = CampaignActionTypes.CampaignsActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class CampaignStatusError implements Action {
	readonly type = CampaignActionTypes.CampaignStatusError;
	constructor(public payload: { err: any }) { }
}

export class CampaignStatusSuccess implements Action {
	readonly type = CampaignActionTypes.CampaignStatusSuccess;
	constructor(public payload: { id: any }) { }
}

export class CampaignDeleted implements Action {
	readonly type = CampaignActionTypes.CampaignDeleted;
	constructor(public payload: { id: any }) {}
}

export class CampaignDeleteError implements Action {
	readonly type = CampaignActionTypes.CampaignDeleteError;
	constructor(public payload: { err: any }) { }
}

export class CampaignDeleteSuccess implements Action {
	readonly type = CampaignActionTypes.CampaignDeleteSuccess;
	constructor(public payload: { id: any }) { }
}

export class CampaignEdited implements Action {
	readonly type = CampaignActionTypes.CampaignEdited;
	constructor(public payload: { campaign: CampaignsEdit }) { }
}

export class CampaignEditSuccess implements Action {
	readonly type = CampaignActionTypes.CampaignEditSuccess;
	constructor(public payload: { campaign: CampaignsEdit }) { }
}
export class CampaignEditError implements Action {
	readonly type = CampaignActionTypes.CampaignEditError;
	constructor(public payload: { err: any }) { }
}

export class CampaignCreated implements Action {
	readonly type = CampaignActionTypes.CampaignCreated;
	constructor(public payload: { campaign: CampaignsEdit }) { }
}

export class CampaignCreateSuccess implements Action {
	readonly type = CampaignActionTypes.CampaignCreateSuccess;
	constructor(public payload: { campaign: CampaignsEdit }) { }
}
export class CampaignCreateError implements Action {
	readonly type = CampaignActionTypes.CampaignCreateError;
	constructor(public payload: { err: any }) { }
}

export class CampaignLoadDcnds implements Action {
	readonly type = CampaignActionTypes.CampaignLoadDcnds;
	constructor(public payload: { page: CampaignSearchDcnds }) { }
}

export class CampaignLoadDcndsSuccess implements Action {
	readonly type = CampaignActionTypes.CampaignLoadDcndsSuccess;
	constructor(
		public payload: {
			dcnds: Dcnd[];
			totalCount: number;
			page: QueryParamsModel;
		}
	) { }
}

export class CampaignLoadCurentDcnds implements Action {
	readonly type = CampaignActionTypes.CampaignLoadCurentDcnds;
	constructor(public payload: { page: CampaignSearchDcnds }) { }
}

export class CampaignLoadCurentDcndsSuccess implements Action {
	readonly type = CampaignActionTypes.CampaignLoadCurentDcndsSuccess;
	constructor(
		public payload: {
			dcnds: Dcnd[];
			totalCount: number;
			page: QueryParamsModel;
		}
	) { }
}

export type CampaignActions =
	| CampaignStatus
	| CampaignsPageLoaded
	| CampaignsPageToggleLoading
	| CampaignsPageRequested
	| CampaignsActionToggleLoading
	| CampaignStatusError
	| CampaignStatusSuccess
	| CampaignDeleted
	| CampaignDeleteError
	| CampaignDeleteSuccess
	| CampaignEdited
	| CampaignEditSuccess
	| CampaignEditError
	| CampaignCreated
	| CampaignCreateSuccess
	| CampaignCreateError
	| CampaignLoadDcnds
	| CampaignLoadDcndsSuccess
	| CampaignLoadCurentDcnds
	| CampaignLoadCurentDcndsSuccess
	;

