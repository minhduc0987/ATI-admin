// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { UserActions, UserActionTypes } from '../_actions/user.actions';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { User } from '../_models/user.model';

// tslint:disable-next-line:no-empty-interface
export interface UsersState extends EntityState<User> {
	listLoading: boolean;
	actionsloading: boolean;
	totalCount: number;
	lastCreatedUserId: number;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	updateFail: any;
	createFail: any;
	deleteFail: any;
	succesCreate: boolean;
	user: any;
	deleteSuccess: boolean;
	updateSuccess: boolean;
}

// export const adapter: EntityAdapter<User> = createEntityAdapter<User>();
export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
	selectId: (user: User) => user.userId
});

export const initialUsersState: UsersState = adapter.getInitialState({
	listLoading: false,
	actionsloading: false,
	totalCount: 0,
	lastQuery: new QueryParamsModel({}),
	lastCreatedUserId: undefined,
	showInitWaitingMessage: true,
	user: User,
	updateFail: undefined,
	createFail: undefined,
	deleteFail: undefined,
	succesCreate: false,
	deleteSuccess: false,
	updateSuccess: false,
});

export function usersReducer(
	state = initialUsersState,
	action: UserActions
): UsersState {
	switch (action.type) {
		case UserActionTypes.UsersPageToggleLoading:
			return {
				...state,
				listLoading: action.payload.isLoading,
				lastCreatedUserId: undefined
			};
		case UserActionTypes.UsersActionToggleLoading:
			return {
				...state,
				actionsloading: action.payload.isLoading
			};
		case UserActionTypes.UserOnServerCreated:
			return {
				...state
			};
		case UserActionTypes.UsersPageCancelled:
			return {
				...state,
				listLoading: false,
				lastQuery: new QueryParamsModel({})
			};
		case UserActionTypes.UsersPageLoaded: {
			return adapter.addMany(action.payload.users, {
				...initialUsersState,
				totalCount: action.payload.totalCount,
				lastQuery: action.payload.page,
				listLoading: false,
				showInitWaitingMessage: false,
				user: action.payload.users
			});
		}
		case UserActionTypes.UserOnServerCreatedError: {
			return {
				...state,
				createFail: action.payload,
				succesCreate: false
			};
		}
		case UserActionTypes.UserCreated:
			return adapter.addOne(action.payload.user, {
				...state,
				succesCreate: true,
				lastCreatedUserId: action.payload.user.userId
			});
		case UserActionTypes.UserOnServerDeletedSuccess:
			return {
				...state,
				deleteSuccess: true,
				deleteFail: undefined
			};
		case UserActionTypes.UserOnServerDeletedError: {
			return {
				...state,
				deleteFail: action.payload,
				deleteSuccess: false,
			};
		}
		case UserActionTypes.ManyUsersDeleted:
			return adapter.removeMany(action.payload.ids, state);
		case UserActionTypes.UserOnServerUpdatedSuccess: {
			return {
				...state,
				updateSuccess: true,
			};
		}
		case UserActionTypes.UserOnServerUpdatedError: {
			return {
				...state,
				updateFail: action.payload,
				updateSuccess: false,
			};
		}
		default:
			return state;
	}
}

export const getUserState = createFeatureSelector<UsersState>('users');

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
