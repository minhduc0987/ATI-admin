// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { DonateActions, DonateActionTypes } from '../_actions/donate.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Donate } from '../_models/donate.model';

// tslint:disable-next-line:no-empty-interface
export interface DonatesState extends EntityState<Donate> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedDonateId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	donate: any;
	approveFail: any;
	approveSuccess: boolean;
	spamFail: any;
	spamSuccess: boolean;
	rejectFail: any;
	rejectSuccess: boolean;
	donateById: any;
	donateDataById: any;
}

// export const adapter: EntityAdapter<Donate> = createEntityAdapter<Donate>();
export const adapter: EntityAdapter<Donate> = createEntityAdapter<Donate>({
	selectId: (donate: Donate) => donate.fundId,
});
export const initialDonatesState: DonatesState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedDonateId: undefined,
	showInitWaitingMessage: true,
	donate: Donate,
	approveFail: undefined,
	approveSuccess: false,
	spamFail: undefined,
	spamSuccess: false,
	rejectFail: undefined,
	rejectSuccess: false,
	donateById: undefined,
	donateDataById: undefined,
});

export function donatesReducer(
	state = initialDonatesState,
	action: DonateActions
): DonatesState {
	switch (action.type) {
		case DonateActionTypes.DonatesPageToggleLoading:
			return {
				...state,
				listLoading: action.payload.isLoading,
				lastCreatedDonateId: undefined
			};
		case DonateActionTypes.DonatesActionToggleLoading:
			return {
				...state,
				actionsloading: action.payload.isLoading
			};
		case DonateActionTypes.DonateApproveSuccess: {
			return {
				...state,
				approveSuccess: true,
				approveFail: undefined
			};
		}
		case DonateActionTypes.DonateApproveError: {
			return {
				...state,
				approveFail: action.payload,
				approveSuccess: false,
			};
		}
		case DonateActionTypes.DonateRejectSuccess: {
			return {
				...state,
				rejectSuccess: true,
				rejectFail: undefined
			};
		}
		case DonateActionTypes.DonateRejectError: {
			return {
				...state,
				rejectFail: action.payload,
				rejectSuccess: false,
			};
		}
		case DonateActionTypes.DonateSpamSuccess: {
			return {
				...state,
				spamSuccess: true,
				spamFail: undefined
			};
		}
		case DonateActionTypes.DonateSpamError: {
			return {
				...state,
				spamFail: action.payload,
				spamSuccess: false,
			};
		}
		case DonateActionTypes.DonatesPageLoaded: {
			return adapter.addMany(action.payload.donates, {
				...initialDonatesState,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false,
				donate: action.payload.donates
			});
		}
		case DonateActionTypes.DonateViewLoad:
			return {
				...state,
				donateById: action.payload.id
			};
		case DonateActionTypes.DonateViewLoadSuccess:
			return {
				...state,
				donateDataById: action.payload.donateData
			};
		default:
			return state;
	}
}

export const getDonateState = createFeatureSelector<DonatesState>('donates');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
