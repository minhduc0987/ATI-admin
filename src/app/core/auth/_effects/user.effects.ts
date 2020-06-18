// Angular
import { Injectable } from '@angular/core';
// RxJS
import { mergeMap, map, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, defer, of, forkJoin } from 'rxjs';
// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
// CRUD
import { QueryResultsModel, QueryParamsModel } from '../../_base/crud';
// Services
import { AuthService } from '../../../core/auth/_services';
// State
import { AppState } from '../../../core/reducers';
import {
	UserActionTypes,
	UsersPageRequested,
	UsersPageLoaded,
	UserCreated,
	UserDeleted,
	UserResetPass,
	ManyUsersDeleted,
	UserUpdated,
	UserOnServerCreated,
	UsersActionToggleLoading,
	UsersPageToggleLoading,
	UserOnServerCreatedError,
	UserOnServerDeletedError,
	UserOnServerDeletedSuccess,
	UserOnServerUpdatedSuccess,
	UserOnServerUpdatedError
} from '../_actions/user.actions';

@Injectable()
export class UserEffects {
	showPageLoadingDistpatcher = new UsersPageToggleLoading({
		isLoading: true
	});
	hidePageLoadingDistpatcher = new UsersPageToggleLoading({
		isLoading: false
	});

	showActionLoadingDistpatcher = new UsersActionToggleLoading({
		isLoading: true
	});
	hideActionLoadingDistpatcher = new UsersActionToggleLoading({
		isLoading: false
	});

	@Effect()
	loadUsersPage$ = this.actions$.pipe(
		ofType<UsersPageRequested>(UserActionTypes.UsersPageRequested),
		mergeMap(({ payload }) => {
			this.store.dispatch(this.showPageLoadingDistpatcher);
			const requestToServer = this.auth.findUsers(payload.page);
			const lastQuery = of(payload.page);
			// tslint:disable-next-line: deprecation
			return forkJoin(requestToServer, lastQuery);
		}),
		map(response => {
			const result: QueryResultsModel = response[0];
			const lastQuery: QueryParamsModel = response[1];
			return new UsersPageLoaded({
				users: result.items,
				totalCount: result.totalCount,
				page: lastQuery
			});
		})
	);

	@Effect()
	resetPassUser$ = this.actions$.pipe(
		ofType<UserDeleted>(UserActionTypes.UserResetPass),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.auth.resetPassUser(payload.id).pipe(
				map(res => {
					return new UserResetPass({ id: res });
				})
			);
		}),
	);

	@Effect()
	deleteUser$ = this.actions$.pipe(
		ofType<UserDeleted>(UserActionTypes.UserDeleted),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.auth.deleteUser(payload.id).pipe(
				map(res => {
					return new UserOnServerDeletedSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new UserOnServerDeletedError({ err }));
				})
			);
		}),
	);

	@Effect()
	deleteUsers$ = this.actions$
		.pipe(
			ofType<ManyUsersDeleted>(UserActionTypes.ManyUsersDeleted),
			mergeMap(({ payload }) => {
				this.store.dispatch(this.showActionLoadingDistpatcher);
				return this.auth.deleteUsers(payload.ids);
			}
			),
			map(() => {
				return this.hideActionLoadingDistpatcher;
			}),
		);

	@Effect()
	updateUser$ = this.actions$.pipe(
		ofType<UserUpdated>(UserActionTypes.UserUpdated),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.auth.updateUser(payload.user).pipe(
				map(res => {
					return new UserOnServerUpdatedSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new UserOnServerUpdatedError({ err }));
				})
			);
		}),
	);

	@Effect()
	createUser$ = this.actions$.pipe(
		ofType<UserOnServerCreated>(UserActionTypes.UserOnServerCreated),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.auth.createUser(payload.user).pipe(
				map(res => {
					return new UserCreated({ user: res });
				}),
				catchError((err) => {
					return of(new UserOnServerCreatedError({ err }));
				})
			);
		}),
		// map(() => {
		// 	return this.hideActionLoadingDistpatcher;
		// })
	);

	constructor(
		private actions$: Actions,
		private auth: AuthService,
		private store: Store<AppState>
	) { }
}
