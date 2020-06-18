// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { Role, QueryParamsRoleModel } from '../_models/role.model';
import { User } from '../_models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

export enum RoleActionTypes {
	AllRolesRequested = '[Roles Home Page] All Roles Requested',
	AllRolesLoaded = '[Roles API] All Roles Loaded',
	RoleOnServerCreated = '[Edit Role Dialog] Role On Server Created',
	RoleCreated = '[Edit Roles Dialog] Roles Created',
	RoleCreateFail = '[Edit Roles Dialog] Roles Create Fail',
	RoleUpdated = '[Edit Role Dialog] Role Updated',
	RoleUpdateSuccess = '[Edit Role Dialog] Role Update Success',
	RoleUpdateFail = '[Edit Role Dialog] Role Update Fail',
	RoleDeleted = '[Roles List Page] Role Deleted',
	RoleDeleteSuccess = '[Roles List Page] Role Delete Success',
	RoleDeleteFail = '[Roles List Page] Role Delete Fail',
	RolesPageRequested = '[Roles List Page] Roles Page Requested',
	RolesPageLoaded = '[Roles API] Roles Page Loaded',
	RolesPageCancelled = '[Roles API] Roles Page Cancelled',
	RolesPageToggleLoading = '[Roles page] Roles Page Toggle Loading',
	RolesActionToggleLoading = '[Roles] Roles Action Toggle Loading',
	RoleUsersList = '[Role user] Role Users List',
	RoleUsersListSuccess = '[Role user] Role Users List Success',
	RoleUsersListFail = '[Role user] Role Users List Fail',
	UsersList = '[ Users List ] Users List',
	UsersListSuccess = '[ Users list Success] Users List Success',
	UsersListFail = '[Users List Fail] Users List Fail',
	UsersRoleUpdate = '[Users Role] Users Role Update',
	UsersRoleUpdateSuccess = '[Users Role] Users Role Update Success',
	UsersRoleUpdateFail = '[Users Role] Users Role Update Fail',
	RoleByIdLoad = '[Role] Role By Id',
	RoleByIdLoadSuccess = '[Role] Role By Id Success',
	RoleByIdLoadFail = '[Role] Role By Id Fail',
	RoleUsersCheckUpdate = '[Role] Role Users Check Update',
	RoleUsersCheckUpdateSuccess = '[Role] Role Users Check Update Success',
	RoleUsersCheckUpdateFail = '[Role] Role Users Check Update Fail',
}

export class RoleOnServerCreated implements Action {
	readonly type = RoleActionTypes.RoleOnServerCreated;
	constructor(public payload: { role: Role }) { }
}

export class RoleCreated implements Action {
	readonly type = RoleActionTypes.RoleCreated;
	constructor(public payload: { role: Role }) { }
}

export class RoleCreateFail implements Action {
	readonly type = RoleActionTypes.RoleCreateFail;
	constructor(public payload: { err: any }) { }
}

export class RoleUpdated implements Action {
	readonly type = RoleActionTypes.RoleUpdated;
	constructor(public payload: {
		partialrole: Update<Role>,
		role: Role
	}) { }
}

export class RoleUpdateSuccess implements Action {
	readonly type = RoleActionTypes.RoleUpdateSuccess;
	constructor(public payload: { role: Role }) { }
}

export class RoleUpdateFail implements Action {
	readonly type = RoleActionTypes.RoleUpdateFail;
	constructor(public payload: { err: any }) { }
}


export class RoleDeleted implements Action {
	readonly type = RoleActionTypes.RoleDeleted;
	constructor(public payload: { roles: any }) { }
}

export class RoleDeleteSuccess implements Action {
	readonly type = RoleActionTypes.RoleDeleteSuccess;
	constructor(public payload: { roles: any }) { }
}

export class RoleDeleteFail implements Action {
	readonly type = RoleActionTypes.RoleDeleteFail;
	constructor(public payload: { err: any }) { }
}

export class RolesPageRequested implements Action {
	readonly type = RoleActionTypes.RolesPageRequested;
	constructor(public payload: { page: QueryParamsModel }) { }
}

export class RolesPageLoaded implements Action {
	readonly type = RoleActionTypes.RolesPageLoaded;
	constructor(public payload: { roles: Role[], totalCount: number, page: QueryParamsModel }) { }
}

export class RolesPageCancelled implements Action {
	readonly type = RoleActionTypes.RolesPageCancelled;
}

export class AllRolesRequested implements Action {
	readonly type = RoleActionTypes.AllRolesRequested;
}

export class AllRolesLoaded implements Action {
	readonly type = RoleActionTypes.AllRolesLoaded;
	constructor(public payload: { roles: Role[] }) { }
}

export class RolesPageToggleLoading implements Action {
	readonly type = RoleActionTypes.RolesPageToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class RolesActionToggleLoading implements Action {
	readonly type = RoleActionTypes.RolesActionToggleLoading;
	constructor(public payload: { isLoading: boolean }) { }
}

export class RoleUsersList implements Action {
	readonly type = RoleActionTypes.RoleUsersList;
	constructor(public payload: {pagination: QueryParamsRoleModel}) {}
}

export class RoleUsersListSuccess implements Action {
	readonly type = RoleActionTypes.RoleUsersListSuccess;
	constructor(public payload: {users: any}) {}
}

export class RoleUsersListFail implements Action {
	readonly type = RoleActionTypes.RoleUsersListFail;
	constructor(public payload: {err: HttpErrorResponse}) {}
}

export class UsersList implements Action {
	readonly type = RoleActionTypes.UsersList;
	constructor(public payload: {pagination: QueryParamsRoleModel}) {}
}

export class UsersListSuccess implements Action {
	readonly type = RoleActionTypes.UsersListSuccess;
	constructor(public payload: {users: any}) {}
}

export class UsersListFail implements Action {
	readonly type = RoleActionTypes.UsersListFail;
	constructor(public payload: {err: HttpErrorResponse}) {}
}

export class UsersRoleUpdate implements Action {
	readonly type = RoleActionTypes.UsersRoleUpdate;
	constructor(public payload: {userRole: Role}) {}
}

export class UsersRoleUpdateSuccess implements Action {
	readonly type = RoleActionTypes.UsersRoleUpdateSuccess;
	constructor(public payload: {load: boolean}) {}
}

export class UsersRoleUpdateFail implements Action {
	readonly type = RoleActionTypes.UsersRoleUpdateFail;
	constructor(public payload: {err: HttpErrorResponse}) {}
}

export class RoleByIdLoad implements Action {
	readonly type = RoleActionTypes.RoleByIdLoad;
	constructor(public payload: {id: number}) {}
}

export class RoleByIdLoadSuccess implements Action {
	readonly type = RoleActionTypes.RoleByIdLoadSuccess;
	constructor(public payload: {role: Role}) {}
}

export class RoleByIdLoadFail implements Action {
	readonly type = RoleActionTypes.RoleByIdLoadFail;
	constructor(public payload: {err: HttpErrorResponse}) {}
}

export class RoleUsersCheckUpdate implements Action {
	readonly type = RoleActionTypes.RoleUsersCheckUpdate;
	constructor(public payload: {userRole: any}) { }
}

export class RoleUsersCheckUpdateSuccess implements Action {
	readonly type = RoleActionTypes.RoleUsersCheckUpdateSuccess;
	constructor(public payload: {load: boolean}) {}
}

export class RoleUsersCheckUpdateFail implements Action {
	readonly type = RoleActionTypes.RoleUsersCheckUpdateFail;
	constructor(public payload: {err: HttpErrorResponse}) {}
}

export type RoleActions = RoleCreated
| RoleUpdated
| RoleUpdateSuccess
| RoleUpdateFail
| RoleDeleted
| RoleDeleteSuccess
| RoleDeleteFail
| RolesPageRequested
| RolesPageLoaded
| RolesPageCancelled
| AllRolesLoaded
| AllRolesRequested
| RoleOnServerCreated
| RolesPageToggleLoading
| RolesActionToggleLoading
| RoleUsersList
| RoleUsersListSuccess
| RoleUsersListFail
| UsersList
| UsersListSuccess
| UsersListFail
| UsersRoleUpdate
| UsersRoleUpdateSuccess
| UsersRoleUpdateFail
| RoleCreateFail
| RoleByIdLoad
| RoleByIdLoadSuccess
| RoleByIdLoadFail
| RoleUsersCheckUpdate
| RoleUsersCheckUpdateSuccess
| RoleUsersCheckUpdateFail;
