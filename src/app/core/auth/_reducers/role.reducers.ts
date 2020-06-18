// NGRX
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import { RoleActions, RoleActionTypes, RoleByIdLoadSuccess } from '../_actions/role.actions';
// Models
import { Role } from '../_models/role.model';
import { QueryParamsModel } from '../../_base/crud';

export interface RolesState extends EntityState<Role> {
	isAllRolesLoaded: boolean;
	queryRowsCount: number;
	queryResult: Role[];
	lastCreatedRoleId: any;
	listLoading: boolean;
	actionsloading: boolean;
	lastQuery: QueryParamsModel;
	showInitWaitingMessage: boolean;
	usersRole: any;
	usersRoleErr: boolean;
	usersList: any;
	usersListErr: boolean;
	userRoleUpdate: boolean;
	userRoleUpdateFail: any;
	createFail: any;
	updateSuccess: any;
	updateFail: any;
	deleteSuccess: any;
	deleteFail: any;
	roleById: any;
	roleUsersCheckSuccess: boolean;
	roleUsersChekFail: any;
}

export const adapter: EntityAdapter<Role> = createEntityAdapter<Role>({
	selectId: (role: Role) => role.roleId
});

export const initialRolesState: RolesState = adapter.getInitialState({
	isAllRolesLoaded: false,
	queryRowsCount: 0,
	queryResult: [],
	lastCreatedRoleId: undefined,
	listLoading: false,
	actionsloading: false,
	lastQuery: new QueryParamsModel({}),
	showInitWaitingMessage: true,
	usersRole: {},
	usersRoleErr: false,
	usersList: {},
	usersListErr: false,
	userRoleUpdate: false,
	userRoleUpdateFail: undefined,
	createSuccess: false,
	createFail: undefined,
	updateSuccess: false,
	updateFail: undefined,
	deleteSuccess: false,
	deleteFail: undefined,
	roleById: undefined,
	roleUsersCheckSuccess: false,
	roleUsersChekFail: undefined
});

export function rolesReducer(state = initialRolesState, action: RoleActions): RolesState {
	switch (action.type) {
		case RoleActionTypes.RolesPageToggleLoading: return {
			...state, listLoading: action.payload.isLoading, lastCreatedRoleId: undefined
		};
		case RoleActionTypes.RolesActionToggleLoading: return {
			...state, actionsloading: action.payload.isLoading
		};
		case RoleActionTypes.RoleOnServerCreated: return {
			...state
		};
		case RoleActionTypes.RoleCreated: return adapter.addOne(action.payload.role, {
			...state, lastCreatedRoleId: true,
			createFail: {}
		});
		case RoleActionTypes.RoleUpdated: return adapter.updateOne(action.payload.partialrole, state);
		case RoleActionTypes.RoleDeleted: return adapter.removeOne(action.payload.roles, state);
		case RoleActionTypes.AllRolesLoaded: return adapter.addAll(action.payload.roles, {
			...state, isAllRolesLoaded: true
		});
		case RoleActionTypes.RolesPageCancelled: return {
			...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
		};
		case RoleActionTypes.RolesPageLoaded:
			return adapter.addMany(action.payload.roles, {
				...initialRolesState,
				listLoading: false,
				queryRowsCount: action.payload.totalCount,
				queryResult: action.payload.roles,
				lastQuery: action.payload.page,
				showInitWaitingMessage: false
			});
		case RoleActionTypes.RoleUsersListSuccess:
			return {
				...state,
				usersRole: action.payload
			};
		case RoleActionTypes.UsersListSuccess:
			return {
				...state,
				usersList: action.payload
			};
		case RoleActionTypes.UsersRoleUpdate:
			return {
				...state,
				userRoleUpdate: false,
				userRoleUpdateFail: undefined
			};
		case RoleActionTypes.UsersRoleUpdateSuccess:
			return {
				...state,
				userRoleUpdate: true,
				userRoleUpdateFail: undefined
			};
		case RoleActionTypes.UsersRoleUpdateFail:
			return {
				...state,
				userRoleUpdate: false,
				userRoleUpdateFail: action.payload
			};
		case RoleActionTypes.RoleCreateFail:
			return {
				...state,
				createFail: action.payload,
				lastCreatedRoleId: false
			};
		case RoleActionTypes.RoleUpdateSuccess:
			return {
				...state,
				updateSuccess: true,
				updateFail: {}
			};
		case RoleActionTypes.RoleUpdateFail:
			return {
				...state,
				updateSuccess: false,
				updateFail: action.payload
			};
		case RoleActionTypes.RoleDeleteSuccess:
			return {
				...state,
				deleteSuccess: true,
				deleteFail: {}
			};
		case RoleActionTypes.RoleDeleteFail:
			return {
				...state,
				updateSuccess: false,
				deleteFail: action.payload
			};
		case RoleActionTypes.RoleByIdLoadSuccess:
			return {
				...state,
				roleById: action.payload.role
			};
		case RoleActionTypes.RoleUsersCheckUpdate:
		return {
			...state,
			roleUsersCheckSuccess: false,
			roleUsersChekFail: undefined
		};
		case RoleActionTypes.RoleUsersCheckUpdateSuccess:
			return {
				...state,
				roleUsersCheckSuccess: true,
				roleUsersChekFail: undefined
			};
		case RoleActionTypes.RoleUsersCheckUpdateFail:
			return {
				...state,
				roleUsersCheckSuccess: false,
				roleUsersChekFail: action.payload
			};
		default: return state;
	}
}

export const {
	selectAll,
	selectEntities,
	selectIds,
	selectTotal
} = adapter.getSelectors();
