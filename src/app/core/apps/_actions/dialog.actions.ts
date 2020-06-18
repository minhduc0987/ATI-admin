// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { Donate, ViewDonate } from '../_models/donate.model';
// Models
import { QueryParamsModel } from '../../_base/crud';
import { HttpErrorResponse } from '@angular/common/http';

export enum DialogActionTypes {
	DialogConfirmed = '[Dialog] Dialog Confirmed',
	DialogClosed = '[Dialog] Dialog Closed'

}
export class DialogConfirmed implements Action {
	readonly type = DialogActionTypes.DialogConfirmed;
}

export class DialogClosed implements Action {
	readonly type = DialogActionTypes.DialogClosed;
}

export type DialogActions = DialogConfirmed | DialogClosed;
