// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { CampaignsState } from '../_reducers/campaign.reducers';
import { each } from 'lodash';
import { Campaign } from '../_models/campaign.model';

export const selectCampaignsState = createFeatureSelector<CampaignsState>('campaigns');

export const selectCampaignById = (code: number) =>
	createSelector(selectCampaignsState, campaignsState => campaignsState.entities[code]);

export const selectCampaignsPageLoading = createSelector(
	selectCampaignsState,
	campaignsState => {
		return campaignsState.listLoading;
	}
);

export const selectCampaignsActionLoading = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.actionsloading
);

export const selectCampaignsPageLastQuery = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.lastQuery
);

export const selectCampaignsInStore = createSelector(
	selectCampaignsState,
	campaignsState => {
		const items: Campaign[] = [];
		each(campaignsState.campaign, element => {
			items.push(element);
		});
		const httpExtension = new HttpExtenstionsModel();
		const result: Campaign[] = httpExtension.sortArray(
			items,
		);
		return new QueryResultsModel(result, campaignsState.totalCount, '');
	}
);

export const selectCampaignsShowInitWaitingMessage = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.showInitWaitingMessage
);

export const selectHasCampaignsInStore = createSelector(
	selectCampaignsState,
	queryResult => {
		if (!queryResult.totalCount) {
			return false;
		}
		return true;
	}
);

export const selectCampaignsUpdateError = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.changeStatusFail
);

export const selectCampaignsUpdateSuccess = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.changeStatusSuccess
);

export const selectCampaignDeleteError = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.deleteFail
);

export const selectCampaignDeleteSuccess = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.deleteSuccess
);

export const selectCampaignEditError = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.editFail
);

export const selectCampaignEditSuccess = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.editSuccess
);

export const selectCampaignCreateError = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.createFail
);

export const selectCampaignCreateSuccess = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.createSuccess
);

export const selectCurentDcnds = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.listdcndsCurent
);

export const selectDcnds = createSelector(
	selectCampaignsState,
	campaignsState => campaignsState.listdcnds
);
