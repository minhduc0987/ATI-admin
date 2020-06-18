import { Action } from '@ngrx/store';

import { DcndEdit } from '..';
import { DcndIndexView } from '../_models/dcnd.model';

export enum DcndEditActionTypes {
	DcndOnServerCreated = '[DCND] DCND On Server Created',
	DcndCreated = '[DCND] DCND Created',
	DcndOnServerUpdated = '[DCND] DCND On Server Updated',
	DcndUpdated = '[DCND] DCND Updated',
	DcndCreateSucceed = '[DCND] DCND Create Succeed',
	DcndRequestedError = '[DCND] DCND Requested Error',
	DcndLoadRequested = '[DCND] DCND Loaded Requested',
	DcndLoadedSucceed = '[DCND] DCND Loaded Succeed',
	DcndLoadedError = '[DCND] DCND Loaded Error',

	DcndIndexViewRequested = '[DCND] DCND Index View Update Requested',
	DcndIndexViewSucceed = '[DCND] DCND Index View Update Succeed'
}
// DungPH -------------------------------------------------------------
export class DcndOnServerCreated implements Action {
	readonly type = DcndEditActionTypes.DcndOnServerCreated;
	constructor(public payload: { dcnd: DcndEdit }) { }
}

export class DcndCreated implements Action {
	readonly type = DcndEditActionTypes.DcndCreated;
	constructor(public payload: { dcnd: DcndEdit }) { }
}

export class DcndOnServerUpdated implements Action {
	readonly type = DcndEditActionTypes.DcndOnServerUpdated;
	constructor(public payload: { dcnd: DcndEdit }) { }
}

export class DcndUpdated implements Action {
	readonly type = DcndEditActionTypes.DcndUpdated;
	constructor(public payload: { dcnd: DcndEdit }) { }
}

export class DcndRequestedError implements Action {
	readonly type = DcndEditActionTypes.DcndRequestedError;
	constructor(public payload: { err: any }) { }
}

export class DcndLoadRequested implements Action {
	readonly type = DcndEditActionTypes.DcndLoadRequested;
	constructor(public payload: { humanityId: number }) { }
}

export class DcndLoadedSucceed implements Action {
	readonly type = DcndEditActionTypes.DcndLoadedSucceed;
	constructor(public payload: { humanity: DcndEdit }) { }
}
export class DcndLoadedError implements Action {
	readonly type = DcndEditActionTypes.DcndLoadedError;
	constructor(public payload: { err: any }) { }
}

export class DcndIndexViewRequested implements Action {
	readonly type = DcndEditActionTypes.DcndIndexViewRequested;
	constructor(public payload: { body: DcndIndexView }) { }
}

export class DcndIndexViewSucceed implements Action {
	readonly type = DcndEditActionTypes.DcndIndexViewSucceed;
}

// ---------------------------------------------------------------------

export type DcndActions =
	DcndOnServerCreated
	| DcndCreated
	| DcndRequestedError
	| DcndLoadRequested
	| DcndLoadedSucceed
	| DcndLoadedError
	| DcndOnServerUpdated
	| DcndUpdated
	| DcndIndexViewRequested
	| DcndIndexViewSucceed;
