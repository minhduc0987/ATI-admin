// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { UserSpamsState } from '../_reducers/user-spam.reducers';
import { each } from 'lodash';
import { UserSpamModel } from '../_models/user-spam.model';
import * as fromUserSpam from '../_reducers/user-spam.reducers';
import { StateEnum } from '../../../shared';

export const selectUserSpamsState = createFeatureSelector<UserSpamsState>(StateEnum.userSpam);

export const selectUserSpamById = (code: number) =>
	createSelector(selectUserSpamsState, userSpamState => userSpamState.entities[code]);

export const selectUserSpamsPageLoading = createSelector(
	selectUserSpamsState,
	userSpamState => {
		return userSpamState.listLoading;
	}
);

export const selectUserSpamsActionLoading = createSelector(
	selectUserSpamsState,
	userSpamState => userSpamState.actionsloading
);

export const selectUserSpamsPageLastQuery = createSelector(
	selectUserSpamsState,
	userSpamState => userSpamState.lastQuery
);

export const selectUserSpamsInStore = createSelector(
	selectUserSpamsState,
	userSpamState => {
		const items: UserSpamModel[] = [];
		each(userSpamState.userSpam, element => {
			items.push(element);
		});
		return new QueryResultsModel(userSpamState.userSpam, userSpamState.totalCount);
	}
);

export const selectUserSpamsShowInitWaitingMessage = createSelector(
	selectUserSpamsState,
	userSpamState => userSpamState.showInitWaitingMessage
);

export const selectHasUserSpamsInStore = createSelector(
	selectUserSpamsState,
	queryResult => {
		if (!queryResult.totalCount) {
			return false;
		}
		return true;
	}
);

export const selectUserSpamUpdateError = createSelector(
	selectUserSpamsState,
	userSpamState => userSpamState.updateFail
);

export const selectUserSpamUpdateSuccess = createSelector(
	selectUserSpamsState,
	userSpamState => userSpamState.updateSuccess
);

export const selectAllUserSpams = createSelector(
	selectUserSpamsState,
	fromUserSpam.selectAll
);
