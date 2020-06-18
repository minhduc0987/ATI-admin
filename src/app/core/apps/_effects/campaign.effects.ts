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
import { CampaignsService } from '../../../core/apps/_services';
// State
import { AppState } from '../../../core/reducers';
import {
	CampaignActionTypes,
	CampaignsPageRequested,
	CampaignsPageLoaded,
	CampaignsActionToggleLoading,
	CampaignsPageToggleLoading,
	CampaignDeleted,
	CampaignEdited,
	CampaignStatus,
	CampaignStatusSuccess,
	CampaignStatusError,
	CampaignDeleteSuccess,
	CampaignDeleteError,
	CampaignEditSuccess,
	CampaignEditError,
	CampaignCreated,
	CampaignCreateSuccess,
	CampaignCreateError,
	CampaignLoadDcnds,
	CampaignLoadDcndsSuccess,
	CampaignLoadCurentDcnds,
	CampaignLoadCurentDcndsSuccess,
} from '../_actions/campaign.actions';
import { CampaignsChangeStatus } from '../_models/campaign.model';

@Injectable()
export class CampaignEffects {
	showPageLoadingDistpatcher = new CampaignsPageToggleLoading({
		isLoading: true
	});
	hidePageLoadingDistpatcher = new CampaignsPageToggleLoading({
		isLoading: false
	});

	showActionLoadingDistpatcher = new CampaignsActionToggleLoading({
		isLoading: true
	});
	hideActionLoadingDistpatcher = new CampaignsActionToggleLoading({
		isLoading: false
	});

	@Effect()
	loadCampaignsPage$ = this.actions$.pipe(
		ofType<CampaignsPageRequested>(CampaignActionTypes.CampaignsPageRequested),
		mergeMap(({ payload }) => {
			this.store.dispatch(this.showPageLoadingDistpatcher);
			const requestToServer = this.campaigns.findCampaigns(payload.page);
			const lastQuery = of(payload.page);
			// tslint:disable-next-line: deprecation
			return forkJoin(requestToServer, lastQuery);
		}),
		map(response => {
			const result: QueryResultsModel = response[0];
			const lastQuery: QueryParamsModel = response[1];
			return new CampaignsPageLoaded({
				campaigns: result.items,
				totalCount: result.totalCount,
				page: lastQuery
			});
		})
	);

	@Effect()
	changeStatusCampaign$ = this.actions$.pipe(
		ofType<CampaignStatus>(CampaignActionTypes.CampaignStatus),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.campaigns.changeStatusCampaign(payload.id).pipe(
				map(res => {
					return new CampaignStatusSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new CampaignStatusError({ err }));
				})
			);
		}),
	);

	@Effect()
	deleteCampaign$ = this.actions$.pipe(
		ofType<CampaignDeleted>(CampaignActionTypes.CampaignDeleted),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.campaigns.deleteCampaign(payload.id).pipe(
				map(res => {
					return new CampaignDeleteSuccess({ id: res });
				}),
				catchError((err) => {
					return of(new CampaignDeleteError({ err }));
				})
			);
		}),
	);

	@Effect()
	editCampaign$ = this.actions$.pipe(
		ofType<CampaignEdited>(CampaignActionTypes.CampaignEdited),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.campaigns.editCampaign(payload.campaign).pipe(
				map(res => {
					return new CampaignEditSuccess({ campaign: res });
				}),
				catchError((err) => {
					return of(new CampaignEditError({ err }));
				})
			);
		}),
	);

	@Effect()
	createCampaign$ = this.actions$.pipe(
		ofType<CampaignCreated>(CampaignActionTypes.CampaignCreated),
		switchMap(({ payload }) => {
			this.store.dispatch(this.showActionLoadingDistpatcher);
			return this.campaigns.createCampaign(payload.campaign).pipe(
				map(res => {
					return new CampaignCreateSuccess({ campaign: res });
				}),
				catchError((err) => {
					return of(new CampaignCreateError({ err }));
				})
			);
		}),
	);

	@Effect()
	loadDcndsPage$ = this.actions$.pipe(
		ofType<CampaignLoadDcnds>(CampaignActionTypes.CampaignLoadDcnds),
		mergeMap(({ payload }) => {
			this.store.dispatch(this.showPageLoadingDistpatcher);
			const requestToServer = this.campaigns.findDcnds(payload.page);
			const lastQuery = of(payload.page);
			// tslint:disable-next-line: deprecation
			return forkJoin(requestToServer, lastQuery);
		}),
		map(response => {
			const result: QueryResultsModel = response[0];
			const lastQuery: QueryParamsModel = response[1];
			return new CampaignLoadDcndsSuccess({
				dcnds: result.items,
				totalCount: result.totalCount,
				page: lastQuery
			});
		})
	);

	@Effect()
	loadCurentDcndsPage$ = this.actions$.pipe(
		ofType<CampaignLoadCurentDcnds>(CampaignActionTypes.CampaignLoadCurentDcnds),
		mergeMap(({ payload }) => {
			this.store.dispatch(this.showPageLoadingDistpatcher);
			const requestToServer = this.campaigns.findCurentDcnds(payload.page);
			const lastQuery = of(payload.page);
			// tslint:disable-next-line: deprecation
			return forkJoin(requestToServer, lastQuery);
		}),
		map(response => {
			const result: QueryResultsModel = response[0];
			const lastQuery: QueryParamsModel = response[1];
			return new CampaignLoadCurentDcndsSuccess({
				dcnds: result.items,
				totalCount: result.totalCount,
				page: lastQuery
			});
		})
	);


	constructor(
		private actions$: Actions,
		private campaigns: CampaignsService,
		private store: Store<AppState>
	) {}
}
