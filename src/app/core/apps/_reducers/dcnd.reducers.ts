// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DcndActions, DcndActionTypes } from '../_actions/dcnd.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Dcnd } from '../_models/dcnd.model';

// tslint:disable-next-line:no-empty-interface
export interface DcndsState extends EntityState<Dcnd> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedDcndId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	deleteFail: any;
	deleteSuccess: boolean;
	updateFail: any;
	updateSuccess: boolean;
	dcnd: Dcnd[];
}

// export const adapter: EntityAdapter<Dcnd> = createEntityAdapter<Dcnd>();
export const adapter: EntityAdapter<Dcnd> = createEntityAdapter<Dcnd>({
	selectId: (dcnd: Dcnd) => dcnd.humanityId,
});
export const initialDcndsState: DcndsState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedDcndId: undefined,
	showInitWaitingMessage: true,
	dcnd: [],
	updateFail: undefined,
	updateSuccess: false,
	deleteFail: undefined,
	deleteSuccess: false,
});

export function dcndsReducer(
	state = initialDcndsState,
	action: DcndActions
): DcndsState {
	switch (action.type) {
		case DcndActionTypes.DcndsPageToggleLoading:
			return {
				...state,
				listLoading: action.payload.isLoading,
				lastCreatedDcndId: undefined
			};
		case DcndActionTypes.DcndsActionToggleLoading:
			return {
				...state,
				actionsloading: action.payload.isLoading
			};
		case DcndActionTypes.DcndOnServerUpdateSuccess: {
			return {
				...state,
				updateSuccess: true,
				updateFail: undefined
			};
		}
		case DcndActionTypes.DcndOnServerUpdateError: {
			return {
				...state,
				updateFail: action.payload,
				updateSuccess: false,
			};
		}
		case DcndActionTypes.DcndOnServerDeleteSuccess:{
			return {
				...state,
				deleteSuccess: true,
				deleteFail: undefined
			};
		}
		case DcndActionTypes.DcndOnServerDeleteError: {
			return {
				...state,
				deleteFail: action.payload,
				deleteSuccess: false,
			};
		}
		case DcndActionTypes.DcndsPageLoaded: {
			return adapter.addMany(action.payload.dcnds, {
				...initialDcndsState,
				listLoading: false,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				dcnd: action.payload.dcnds,
				showInitWaitingMessage: false,
			});
		}
		default:
			return state;
	}
}

export const getDcndState = createFeatureSelector<DcndsState>('dcnds');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
