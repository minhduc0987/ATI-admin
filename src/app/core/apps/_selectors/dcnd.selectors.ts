// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DcndsState } from '../_reducers/dcnd.reducers';
import { each } from 'lodash';
import { Dcnd } from '../_models/dcnd.model';
import * as fromDcnd from '../_reducers/dcnd.reducers';

export const selectDcndsState = createFeatureSelector<DcndsState>('dcnds');

export const selectDcndById = (code: number) =>
	createSelector(selectDcndsState, dcndsState => dcndsState.entities[code]);

export const selectDcndsPageLoading = createSelector(
	selectDcndsState,
	dcndsState => {
		return dcndsState.listLoading;
	}
);

export const selectDcndsActionLoading = createSelector(
	selectDcndsState,
	dcndsState => dcndsState.actionsloading
);

export const selectDcndsPageLastQuery = createSelector(
	selectDcndsState,
	dcndsState => dcndsState.lastQuery
);

export const selectDcndsInStore = createSelector(
	selectDcndsState,
	dcndsState => {
		const items: Dcnd[] = [];
		each(dcndsState.dcnd, element => {
			items.push(element);
		});
		return new QueryResultsModel(dcndsState.dcnd, dcndsState.totalCount);
	}
);

export const selectDcndsShowInitWaitingMessage = createSelector(
	selectDcndsState,
	dcndsState => dcndsState.showInitWaitingMessage
);

export const selectHasDcndsInStore = createSelector(
	selectDcndsState,
	queryResult => {
		if (!queryResult.totalCount) {
			return false;
		}
		return true;
	}
);

export const selectUpdateError = createSelector(
	selectDcndsState,
	dcndsState => dcndsState.updateFail
);

export const selectUpdateSuccess = createSelector(
	selectDcndsState,
	dcndsState => dcndsState.updateSuccess
);

export const selectDeleteError = createSelector(
	selectDcndsState,
	dcndsState => dcndsState.deleteFail
);

export const selectDeleteSuccess = createSelector(
	selectDcndsState,
	dcndsState => dcndsState.deleteSuccess
);

export const selectAllDcnds = createSelector(
	selectDcndsState,
	fromDcnd.selectAll
);
