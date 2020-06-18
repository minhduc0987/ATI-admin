import { Role } from './../_models/role.model';

// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { RolesState } from '../_reducers/role.reducers';
import * as fromRole from '../_reducers/role.reducers';
import { each } from 'lodash';

export const selectRolesState = createFeatureSelector<RolesState>('roles');

export const selectRoleById = (roleId: number) => createSelector(
	selectRolesState,
	rolesState => rolesState.entities[roleId]
);

export const selectAllRoles = createSelector(
	selectRolesState,
	fromRole.selectAll
);

export const selectAllRolesIds = createSelector(
	selectRolesState,
	fromRole.selectIds
);

export const allRolesLoaded = createSelector(
	selectRolesState,
	rolesState => rolesState.isAllRolesLoaded
);


export const selectRolesPageLoading = createSelector(
	selectRolesState,
	rolesState => rolesState.listLoading
);

export const selectRolesActionLoading = createSelector(
	selectRolesState,
	rolesState => rolesState.actionsloading
);

export const selectLastCreatedRoleId = createSelector(
	selectRolesState,
	rolesState => rolesState.lastCreatedRoleId
);

export const selectRolesShowInitWaitingMessage = createSelector(
	selectRolesState,
	rolesState => rolesState.showInitWaitingMessage
);


export const selectQueryResult = createSelector(
	selectRolesState,
	rolesState => {
		const items: Role[] = [];
		each(rolesState.entities, element => {
			items.push(element);
		});
		// const httpExtension = new HttpExtenstionsModel();
		// const result: Role[] = httpExtension.sortArray(items, rolesState.lastQuery.sortField, rolesState.lastQuery.sortOrder);

		return new QueryResultsModel(rolesState.queryResult, rolesState.queryRowsCount);
	}
);

export const selectUsersRole = createSelector(
	selectRolesState,
	rolesState => rolesState.usersRole
);

export const selectUsersList = createSelector(
	selectRolesState,
	rolesState => rolesState.usersList
);

export const selectUsersRoleUpdate = createSelector(
	selectRolesState,
	rolesState => rolesState.userRoleUpdate
);

export const selectUsersRoleUpdateFail = createSelector(
	selectRolesState,
	rolesState => rolesState.userRoleUpdateFail
);

export const selectCreateRoleFail = createSelector(
	selectRolesState,
	rolesState => rolesState.createFail
);

export const selectUpdateRoleSuccess = createSelector(
	selectRolesState,
	rolesState => rolesState.updateSuccess
);

export const selectUpdateRoleFail = createSelector(
	selectRolesState,
	rolesState => rolesState.updateFail
);

export const selectDeleteRoleSuccess = createSelector(
	selectRolesState,
	rolesState => rolesState.deleteSuccess
);

export const selectDeleteRoleFail = createSelector(
	selectRolesState,
	rolesState => rolesState.deleteFail
);

export const selectRolePermissionById = createSelector(
	selectRolesState,
	rolesState => rolesState.roleById
);

export const SelectRoleUsersCheckSuccess = createSelector(
	selectRolesState,
	rolesState => rolesState.roleUsersCheckSuccess
);

export const SelectRoleUsersCheckFail = createSelector(
	selectRolesState,
	rolesState => rolesState.roleUsersChekFail
);

