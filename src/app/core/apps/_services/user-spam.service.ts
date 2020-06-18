// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// RxJS
import { Observable, forkJoin } from 'rxjs';
// CRUD
import { HttpUtilsService, QueryParamsModel, QueryResultsModel } from '../../_base/crud';
// Models
import { UserSpamModel, UserSpamUpdateModel } from '../_models/user-spam.model';
import { environment } from '../../../../environments/environment';

const API_US_SEARCH_URL = environment.apiUrl + 'user/lock/search';
const API_US_STATUS_URL = environment.apiUrl + 'user/post/unlock';



@Injectable()
export class UserSpamService {

	constructor(private http: HttpClient) {
	}

	findUserSpams(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.http.post<QueryResultsModel>(API_US_SEARCH_URL, queryParams);
	}

	// tslint:disable-next-line: variable-name
	updateUserSpam(userSpam: UserSpamUpdateModel): Observable<any> {
		return this.http.put(API_US_STATUS_URL, userSpam);
	}

}
