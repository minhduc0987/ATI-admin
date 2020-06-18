// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DcndActions, DcndEditActionTypes } from '../_actions/dcnd-edit.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Dcnd, DcndEdit } from '../_models/dcnd.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface DcndEditState {
	dcndCode: string;
	errorMes: HttpErrorResponse;
	loadedError: HttpErrorResponse;
	dcnd: DcndEdit;
	_isCreated: boolean;
	_isUpdated: boolean;

}

export const initialDcndsState: DcndEditState = {
	dcndCode: null,
	errorMes: null,
	dcnd: null,
	_isCreated: false,
	_isUpdated: false,
	loadedError: null

};

export function dcndsEditReducer(state = initialDcndsState, action: DcndActions): DcndEditState {
	switch (action.type) {
		case DcndEditActionTypes.DcndOnServerCreated:
			return {
				...state,
				dcndCode: null,
				errorMes: null,
				dcnd: null,
				_isCreated: false,
				_isUpdated: false,
				loadedError: null
			};
		case DcndEditActionTypes.DcndCreated:
			return {
				...state,
				dcndCode: action.payload.dcnd.code,
				_isCreated: true
			};
		case DcndEditActionTypes.DcndOnServerUpdated:
			return {
				...state,
				dcndCode: null,
				errorMes: null,
				dcnd: null,
				_isCreated: false,
				_isUpdated: false,
				loadedError: null
			};
		case DcndEditActionTypes.DcndUpdated:
			return {
				...state,
				dcndCode: action.payload.dcnd.code,
				_isUpdated: true
			};
		case DcndEditActionTypes.DcndRequestedError:
			return {
				...state,
				errorMes: action.payload.err
			};
		case DcndEditActionTypes.DcndLoadRequested:
			return {
				...state,
				dcndCode: null,
				errorMes: null,
				dcnd: null,
				_isCreated: false,
				_isUpdated: false,
				loadedError: null
			};
		case DcndEditActionTypes.DcndLoadedSucceed:
			return {
				...state,
				dcnd: action.payload.humanity
			};
		case DcndEditActionTypes.DcndLoadedError:
			return {
				...state,
				loadedError: action.payload.err
			};
		case DcndEditActionTypes.DcndIndexViewSucceed:
			return {
				...state,
				_isUpdated: true
			};
		default:
			return state;
	}
}
