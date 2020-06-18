// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable, forkJoin } from 'rxjs';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models
import { Dcnd, DcndEdit, DcndIndexView } from '../_models/dcnd.model';
import { environment } from '../../../../environments/environment';

const API_HUMANITY_URL = environment.apiUrl + 'humanity';

@Injectable()
export class DcndsService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

	findDcnds(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_HUMANITY_URL + '/search', queryParams, { headers: httpHeaders });
	}

	deleteDcnd(humanitId: any) {
		const url = `${API_HUMANITY_URL + '/remove'}`;
		return this.http.put(url, humanitId);
	}
	deleteDcnds(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteDcnd(ids[i]));
		}
		return forkJoin(tasks$);
	}
	// tslint:disable-next-line: variable-name
	updateDcnd(_dcnd: Dcnd): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_HUMANITY_URL + '/status', _dcnd, { headers: httpHeaders });
	}

	createDcnd(dcnd: DcndEdit): Observable<DcndEdit> {
		return this.http.post<DcndEdit>(API_HUMANITY_URL + '/create', dcnd);
	}

	updateDcndEdit(dcnd: DcndEdit): Observable<DcndEdit> {
		return this.http.put<DcndEdit>(API_HUMANITY_URL + '/update', dcnd);
	}

	getDcnd(humanitId: number): Observable<DcndEdit> {
		return this.http.get<DcndEdit>(`${API_HUMANITY_URL}/${humanitId}`);
	}

	updateIndexView(indexView: DcndIndexView) {
		return this.http.put(`${API_HUMANITY_URL}/index-view`, indexView);
	}

}
