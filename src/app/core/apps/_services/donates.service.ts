// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable, forkJoin } from 'rxjs';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models
import { environment } from '../../../../environments/environment';
import { Donate, DonatesStatus } from '../_models/donate.model';

const API_DONATE_URL = environment.apiUrl + 'fund_plan';

@Injectable()
export class DonatesService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	findDonates(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_DONATE_URL + '/search', queryParams, { headers: httpHeaders });
	}
	// tslint:disable-next-line: variable-name
	approveDonate(_donate: DonatesStatus): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_DONATE_URL + '/approved/' + _donate.fundId , _donate , { headers: httpHeaders });
	}

	// tslint:disable-next-line: variable-name
	spamDonate(_donate: DonatesStatus): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_DONATE_URL + '/spam/' + _donate.fundId, _donate , { headers: httpHeaders });
	}

	// tslint:disable-next-line: variable-name
	rejectDonate(_donate: DonatesStatus): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_DONATE_URL + '/reject/' + _donate.fundId, _donate , { headers: httpHeaders });
	}

	// tslint:disable-next-line: variable-name
	detailViewDonate(fundId: number): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.get(API_DONATE_URL + '/detail/' + fundId, { headers: httpHeaders });
	}
}
