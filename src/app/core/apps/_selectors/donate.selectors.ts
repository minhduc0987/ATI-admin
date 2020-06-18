// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DonatesState } from '../_reducers/donate.reducers';
import { each } from 'lodash';
import { Donate, ViewDonate } from '../_models/donate.model';

export const selectDonatesState = createFeatureSelector<DonatesState>('donates');

export const selectDonateById = (code: number) =>
	createSelector(selectDonatesState, donatesState => donatesState.entities[code]);

export const selectDonatesPageLoading = createSelector(
	selectDonatesState,
	donatesState => {
		return donatesState.listLoading;
	}
);

export const selectDonatesActionLoading = createSelector(
	selectDonatesState,
	donatesState => donatesState.actionsloading
);

export const selectDonatesPageLastQuery = createSelector(
	selectDonatesState,
	donatesState => donatesState.lastQuery
);

export const selectDonatesInStore = createSelector(
	selectDonatesState,
	donatesState => {
		const items: Donate[] = [];
		each(donatesState.donate, element => {
			items.push(element);
		});
		const httpExtension = new HttpExtenstionsModel();
		const result: Donate[] = httpExtension.sortArray(
			items,
		);
		return new QueryResultsModel(result, donatesState.totalCount, '');
	}
);

export const selectDonatesShowInitWaitingMessage = createSelector(
	selectDonatesState,
	donatesState => donatesState.showInitWaitingMessage
);

export const selectHasDonatesInStore = createSelector(
	selectDonatesState,
	queryResult => {
		if (!queryResult.totalCount) {
			return false;
		}
		return true;
	}
);

export const selectDonateApproveError = createSelector(
	selectDonatesState,
	donatesState => donatesState.approveFail
);

export const selectDonateApproveSuccess = createSelector(
	selectDonatesState,
	donatesState => donatesState.approveSuccess
);
export const selectDonateSpamError = createSelector(
	selectDonatesState,
	donatesState => donatesState.spamFail
);

export const selectDonateSpamSuccess = createSelector(
	selectDonatesState,
	donatesState => donatesState.spamSuccess
);
export const selectDonateRejectError = createSelector(
	selectDonatesState,
	donatesState => donatesState.rejectFail
);

export const selectDonateRejectSuccess = createSelector(
	selectDonatesState,
	donatesState => donatesState.rejectSuccess
);

export const selectViewDonateId = createSelector(
	selectDonatesState,
	donatesState => donatesState.donateDataById
);

