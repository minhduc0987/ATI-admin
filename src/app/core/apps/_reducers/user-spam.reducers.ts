// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { UserSpamActions, UserSpamActionTypes } from '../_actions/user-spam.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { UserSpamModel } from '../_models/user-spam.model';
import { StateEnum } from '../../../shared';
import { HttpErrorResponse } from '@angular/common/http';

// tslint:disable-next-line:no-empty-interface
export interface UserSpamsState extends EntityState<UserSpamModel> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedUserSpamId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	updateFail: any;
	updateSuccess: boolean;
	userSpam: UserSpamModel[];
	pageError: HttpErrorResponse;
}

// export const adapter: EntityAdapter<UserSpamModel> = createEntityAdapter<UserSpamModel>();
export const adapter: EntityAdapter<UserSpamModel> = createEntityAdapter<UserSpamModel>({
	selectId: (userSpam: UserSpamModel) => userSpam.userId,
});
export const initialUserSpamsState: UserSpamsState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedUserSpamId: undefined,
	showInitWaitingMessage: true,
	userSpam: [],
	updateFail: undefined,
	updateSuccess: false,
	deleteFail: undefined,
	deleteSuccess: false,
	pageError: undefined
});

export function UserSpamsReducer(
	state = initialUserSpamsState,
	action: UserSpamActions
): UserSpamsState {
	switch (action.type) {
		case UserSpamActionTypes.UserSpamsPageToggleLoading:
			return {
				...state,
				listLoading: action.payload.isLoading,
				lastCreatedUserSpamId: undefined
			};
		case UserSpamActionTypes.UserSpamsActionToggleLoading:
			return {
				...state,
				actionsloading: action.payload.isLoading
			};
		case UserSpamActionTypes.UserSpamOnServerUpdateSuccess: {
			return {
				...state,
				updateSuccess: true,
				updateFail: undefined
			};
		}
		case UserSpamActionTypes.UserSpamOnServerUpdateError: {
			return {
				...state,
				updateFail: action.payload,
				updateSuccess: false,
			};
		}
		case UserSpamActionTypes.UserSpamsPageLoaded: {
			return adapter.addMany(action.payload.userSpam, {
				...initialUserSpamsState,
				listLoading: false,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				userSpam: action.payload.userSpam,
				showInitWaitingMessage: false,
			});
		}
		case UserSpamActionTypes.UserSpamError: {
			return {
				...state,
				showInitWaitingMessage: false,
				pageError: action.payload.error
			};
		}
		default:
			return state;
	}
}

export const getUserSpamState = createFeatureSelector<UserSpamsState>(StateEnum.userSpam);

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
