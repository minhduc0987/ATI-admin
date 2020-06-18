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
import { DcndsService } from '../../../core/apps/_services';
// State
import { AppState } from '../../../core/reducers';
import {
	DcndEditActionTypes,
	DcndOnServerCreated,
	DcndCreated,
	DcndRequestedError,
	DcndLoadRequested,
	DcndLoadedSucceed,
	DcndLoadedError,
	DcndOnServerUpdated,
	DcndUpdated,
	DcndIndexViewRequested,
	DcndIndexViewSucceed
} from '../_actions/dcnd-edit.actions';

@Injectable()
export class DcndEditEffects {
	@Effect()
	createDcnd$ = this.actions$.pipe(
		ofType<DcndOnServerCreated>(DcndEditActionTypes.DcndOnServerCreated),
		switchMap(({ payload }) => {
			return this.dcnds.createDcnd(payload.dcnd).pipe(
				map((res) => {
					return new DcndCreated({ dcnd: res });
				}),
				catchError((err) => {
					return of(new DcndRequestedError({ err }));
				})
			);
		}),
	);

	@Effect()
	updateDcnd$ = this.actions$.pipe(
		ofType<DcndOnServerUpdated>(DcndEditActionTypes.DcndOnServerUpdated),
		switchMap(({ payload }) => {
			return this.dcnds.updateDcndEdit(payload.dcnd).pipe(
				map((res) => {
					return new DcndUpdated({ dcnd: res });
				}),
				catchError((err) => {
					return of(new DcndRequestedError({ err }));
				})
			);
		}),
	);

	@Effect()
	loadDcnd$ = this.actions$.pipe(
		ofType<DcndLoadRequested>(DcndEditActionTypes.DcndLoadRequested),
		switchMap(({ payload }) => {
			return this.dcnds.getDcnd(payload.humanityId).pipe(
				map((res) => {
					return new DcndLoadedSucceed({ humanity: res });
				}),
				catchError((err) => {
					return of(new DcndLoadedError({ err }));
				})
			);
		}),
	);

	@Effect()
	updateIndexView$ = this.actions$.pipe(
		ofType<DcndIndexViewRequested>(DcndEditActionTypes.DcndIndexViewRequested),
		switchMap(({ payload }) => {
			return this.dcnds.updateIndexView(payload.body).pipe(
				map((res) => {
					return new DcndIndexViewSucceed();
				}),
				catchError((err) => {
					return of(new DcndRequestedError({ err }));
				})
			);
		}),
	);

	constructor(
		private actions$: Actions,
		private dcnds: DcndsService,
	) { }
}
