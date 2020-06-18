// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable, forkJoin } from 'rxjs';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models
import { Campaign, CampaignsChangeStatus, CampaignsEdit, CampaignSearchDcnds } from '../_models/campaign.model';
import { environment } from '../../../../environments/environment';

const API_CAMPAIGN_URL = environment.apiUrl + 'campaign';
const API_CURENT_DCND_URL = environment.apiUrl + 'campaign/curent-humanity';
const API_DCND_URL = environment.apiUrl + 'campaign/search-humanity';

@Injectable()
export class CampaignsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	findCampaigns(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_CAMPAIGN_URL + '/search', queryParams, { headers: httpHeaders });
	}

	deleteCampaign(humanitIds: any) {
		const url = `${API_CAMPAIGN_URL + '/remove'}`;
		return this.http.put(url, humanitIds);
	}
	deleteCampaigns(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteCampaign(ids[i]));
		}
		return forkJoin(tasks$);
	}
	// tslint:disable-next-line: variable-name
	changeStatusCampaign(_campaign: CampaignsChangeStatus): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_CAMPAIGN_URL + '/status', _campaign, { headers: httpHeaders });
	}
	// tslint:disable-next-line: variable-name
	editCampaign(_campaign: CampaignsEdit): Observable<CampaignsEdit> {
		return this.http.post<CampaignsEdit>(API_CAMPAIGN_URL + '/create', _campaign);
	}

	// tslint:disable-next-line: variable-name
	createCampaign(_campaign: CampaignsEdit): Observable<CampaignsEdit> {
		return this.http.post<CampaignsEdit>(API_CAMPAIGN_URL + '/create', _campaign);
	}

	findCurentDcnds(queryParams: CampaignSearchDcnds): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_CURENT_DCND_URL + '/' + queryParams.campaignId, queryParams, { headers: httpHeaders });
	}

	findDcnds(queryParams: CampaignSearchDcnds): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_DCND_URL + '/' + queryParams.campaignId, queryParams, { headers: httpHeaders });
	}
}
