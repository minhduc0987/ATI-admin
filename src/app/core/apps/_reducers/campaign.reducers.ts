// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { CampaignActions, CampaignActionTypes } from '../_actions/campaign.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Campaign } from '../_models/campaign.model';

// tslint:disable-next-line:no-empty-interface
export interface CampaignsState extends EntityState<Campaign> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedCampaignId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	campaign: any;
	deleteFail: any;
	deleteSuccess: boolean;
	changeStatusFail: any;
	changeStatusSuccess: boolean;
	editFail: any;
	editSuccess: boolean;
	createFail: any;
	createSuccess: boolean;
	listdcndsCurent: any;
	listdcnds: any;
}

// export const adapter: EntityAdapter<Campaign> = createEntityAdapter<Campaign>();
export const adapter: EntityAdapter<Campaign> = createEntityAdapter<Campaign>({
	selectId: (campaign: Campaign) => campaign.campaignId,
});
export const initialCampaignsState: CampaignsState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedCampaignId: undefined,
	showInitWaitingMessage: true,
	campaign: Campaign,
	changeStatusFail: undefined,
	changeStatusSuccess: false,
	deleteFail: undefined,
	deleteSuccess: false,
	editFail: undefined,
	editSuccess: false,
	createFail: undefined,
	createSuccess: false,
	listdcndsCurent: undefined,
	listdcnds: undefined,
});

export function campaignsReducer(
	state = initialCampaignsState,
	action: CampaignActions
): CampaignsState {
	switch (action.type) {
		case CampaignActionTypes.CampaignsPageToggleLoading:
			return {
				...state,
				listLoading: action.payload.isLoading,
				lastCreatedCampaignId: undefined
			};
		case CampaignActionTypes.CampaignsActionToggleLoading:
			return {
				...state,
				actionsloading: action.payload.isLoading
			};
		case CampaignActionTypes.CampaignStatusSuccess: {
			return {
				...state,
				changeStatusSuccess: true,
				changeStatusFail: undefined
			};
		}
		case CampaignActionTypes.CampaignStatusError: {
			return {
				...state,
				changeStatusFail: action.payload,
				changeStatusSuccess: false,
			};
		}
		case CampaignActionTypes.CampaignDeleteSuccess:{
			return {
				...state,
				deleteSuccess: true,
				deleteFail: undefined
			};
		}
		case CampaignActionTypes.CampaignDeleteError: {
			return {
				...state,
				deleteFail: action.payload,
				deleteSuccess: false,
			};
		}
		case CampaignActionTypes.CampaignEditSuccess:{
			return {
				...state,
				editSuccess: true,
				editFail: undefined
			};
		}
		case CampaignActionTypes.CampaignEditError: {
			return {
				...state,
				editFail: action.payload,
				editSuccess: false,
			};
		}
		case CampaignActionTypes.CampaignCreateSuccess:{
			return {
				...state,
				createSuccess: true,
				createFail: undefined
			};
		}
		case CampaignActionTypes.CampaignCreateError: {
			return {
				...state,
				createFail: action.payload,
				createSuccess: false,
			};
		}
		case CampaignActionTypes.CampaignsPageLoaded: {
			return adapter.addMany(action.payload.campaigns, {
				...initialCampaignsState,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false,
				campaign: action.payload.campaigns
			});
		}
		case CampaignActionTypes.CampaignLoadDcndsSuccess:
			return {
				...state,
				listdcnds: action.payload
			};
		case CampaignActionTypes.CampaignLoadCurentDcndsSuccess:
			return {
				...state,
				listdcndsCurent: action.payload
			};
		default:
			return state;
	}
}

export const getCampaignState = createFeatureSelector<CampaignsState>('campaigns');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
