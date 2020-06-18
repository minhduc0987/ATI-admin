// Angular
import { Injectable } from '@angular/core';
// RxJS
import { of, Observable, defer, forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, tap, switchMap, catchError, exhaust, exhaustMap } from 'rxjs/operators';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { AuthService } from '../_services';
// State
import { AppState } from '../../../core/reducers';
// Selectors
import { allRolesLoaded } from '../_selectors/role.selectors';
// Actions
import {
	AllRolesLoaded,
	AllRolesRequested,
	RoleActionTypes,
	RolesPageRequested,
	RolesPageLoaded,
	RoleUpdated,
	RolesPageToggleLoading,
	RoleDeleted,
	RoleOnServerCreated,
	RoleCreated,
	RolesActionToggleLoading,
	RoleUsersList,
	RoleUsersListSuccess,
	RoleUsersListFail,
	UsersListSuccess,
	UsersListFail,
	UsersRoleUpdate,
	UsersRoleUpdateSuccess,
	UsersRoleUpdateFail,
	RoleCreateFail,
	RoleUpdateSuccess,
	RoleUpdateFail,
	RoleDeleteSuccess,
	RoleDeleteFail,
	RoleByIdLoad,
	RoleByIdLoadSuccess,
	RoleByIdLoadFail,
	UsersList,
	RoleUsersCheckUpdate,
	RoleUsersCheckUpdateSuccess,
	RoleUsersCheckUpdateFail
} from '../_actions/role.actions';
import { QueryParamsRoleModel } from '../_models/role.model';

@Injectable()
export class RoleEffects {
	showPageLoadingDistpatcher = new RolesPageToggleLoading({ isLoading: true });
	hidePageLoadingDistpatcher = new RolesPageToggleLoading({ isLoading: false });

	showActionLoadingDistpatcher = new RolesActionToggleLoading({ isLoading: true });
	hideActionLoadingDistpatcher = new RolesActionToggleLoading({ isLoading: false });

	// @Effect()
	// loadAllRoles$ = this.actions$
	// 	.pipe(
	// 		ofType<AllRolesRequested>(RoleActionTypes.AllRolesRequested),
	// 		withLatestFrom(this.store.pipe(select(allRolesLoaded))),
	// 		filter(([action, isAllRolesLoaded]) => !isAllRolesLoaded),
	// 		mergeMap(() => this.auth.getAllRoles()),
	// 		map(roles => {
	// 			return new AllRolesLoaded({ roles });
	// 		})
	// 	);

	@Effect()
	loadRolesPage$ = this.actions$
		.pipe(
			ofType<RolesPageRequested>(RoleActionTypes.RolesPageRequested),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showPageLoadingDistpatcher);
				const requestToServer = this.auth.getRoles(payload.page);
				const lastQuery = of(payload.page);
				return forkJoin(requestToServer, lastQuery);
			}),
			map(response => {
				const result: QueryResultsModel = response[0];
				const lastQuery: QueryParamsModel = response[1];
				this.store.dispatch(this.hidePageLoadingDistpatcher);

				return new RolesPageLoaded({
					roles: result.items,
					totalCount: result.totalCount,
					page: lastQuery
				});
			}),
		);


	@Effect()
	deleteRole$ = this.actions$
		.pipe(
			ofType<RoleDeleted>(RoleActionTypes.RoleDeleted),
			switchMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.deleteRole(payload.roles).pipe(
					map(res => {
						return new RoleDeleteSuccess({ roles: res });
					}),
					catchError(error => {
						return of(new RoleDeleteFail({ err: error }));
					})
				);
			}),
		);

	@Effect()
	updateRole$ = this.actions$
		.pipe(
			ofType<RoleUpdated>(RoleActionTypes.RoleUpdated),
			switchMap(({ payload }) => {
				return this.auth.updateRole(payload.role).pipe(
					map(res => {
						return new RoleUpdateSuccess({ role: res });
					}),
					catchError(error => {
						return of(new RoleUpdateFail({ err: error }));
					})
				);
			}),
		);

	@Effect()
	createRole$ = this.actions$
		.pipe(
			ofType<RoleOnServerCreated>(RoleActionTypes.RoleOnServerCreated),
			switchMap(({ payload }) => {
				return this.auth.createRole(payload.role).pipe(
					map(res => {
						return new RoleCreated({ role: res });
					}),
					catchError(error => {
						return of(new RoleCreateFail({ err: error }));
					})
				);
			}),
		);

	@Effect()
	loadUsersRole$ = this.actions$
		.pipe(
			ofType<RoleUsersList>(RoleActionTypes.RoleUsersList),
			switchMap(({ payload }) => {
				return this.auth.getUsersRole(payload.pagination).pipe(
					map(res => {
						return new RoleUsersListSuccess({ users: res });
					}),
					catchError(error => {
						return of(new RoleUsersListFail({ err: error }));
					})
				);
			})
		);

	@Effect()
	loadUsersList$ = this.actions$
		.pipe(
			ofType<UsersList>(RoleActionTypes.UsersList),
			switchMap(({ payload }) => {
				return this.auth.getUsersRole(payload.pagination).pipe(
					map(res => {
						return new UsersListSuccess({ users: res });
					}),
					catchError(error => {
						return of(new UsersListFail({ err: error }));
					})
				);
			})
		);

	@Effect()
	saveUsersRole$ = this.actions$
		.pipe(
			ofType<UsersRoleUpdate>(RoleActionTypes.UsersRoleUpdate),
			withLatestFrom(this.store.pipe(select(state => state))),
			exhaustMap(( action, state ) => {
				return this.auth.userRoleUnCheck(action[0].payload.userRole).pipe(
					tap(data => {
						const queryParams = new QueryParamsRoleModel(
							{keyword: ''},
							0,
							10,
							'CHECKED',
							action[0].payload.userRole.roleId
						);
						this.store.dispatch( new RoleUsersList({ pagination: queryParams }));
						const queryParamsUncheck = new QueryParamsRoleModel(
							{keyword: ''},
							0,
							10,
							'UNCHECKED',
							action[0].payload.userRole.roleId
						);
						this.store.dispatch(new UsersList({ pagination: queryParamsUncheck }));
					}),
					map(res => {
						console.log('effect check', res);
						return new UsersRoleUpdateSuccess({ load: true });
					}),
					catchError(error => {
						return of(new UsersRoleUpdateFail({ err: error }));
					})
				);
			})
		);

	@Effect()
	saveUsersRoleCheck$ = this.actions$
		.pipe(
			ofType<RoleUsersCheckUpdate>(RoleActionTypes.RoleUsersCheckUpdate),
			withLatestFrom(this.store.pipe(select(state => state))),
			exhaustMap(( action, state ) => {
				return this.auth.userRoleCheck(action[0].payload.userRole).pipe(
					tap(data => {
						const queryParams = new QueryParamsRoleModel(
							{keyword: ''},
							0,
							10,
							'CHECKED',
							action[0].payload.userRole.roleId
						);
						this.store.dispatch( new RoleUsersList({ pagination: queryParams }));
						const queryParamsUncheck = new QueryParamsRoleModel(
							{keyword: ''},
							0,
							10,
							'UNCHECKED',
							action[0].payload.userRole.roleId
						);
						this.store.dispatch(new UsersList({ pagination: queryParamsUncheck }));
					}),
					map(res => {
						console.log('effect uncheck', res);
						return new RoleUsersCheckUpdateSuccess({ load: true });
					}),
					catchError(error => {
						return of(new RoleUsersCheckUpdateFail({ err: error }));
					})
				);
			})
		);

	@Effect()
	getRoleById$ = this.actions$
		.pipe(
			ofType<RoleByIdLoad>(RoleActionTypes.RoleByIdLoad),
			switchMap(({ payload }) => {
				return this.auth.getRoleById(payload.id).pipe(
					map(res => {
						return new RoleByIdLoadSuccess({ role: res });
					}),
					catchError(error => {
						return of(new RoleByIdLoadFail({ err: error }));
					})
				);
			})
		);

	@Effect()
	init$: Observable<Action> = defer(() => {
		return of(new AllRolesRequested());
	});

	constructor(private actions$: Actions, private auth: AuthService, private store: Store<AppState>) { }
}
