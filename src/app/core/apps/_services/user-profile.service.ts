import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { UserProfile } from '../_models/user-profile.model';
import { ChangePassword} from '../_models/change-password.model';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { filter, some, find, each } from 'lodash';
import { User } from '../../auth';

const API_USERS_INFO_URL = environment.apiUrl + 'user/info';
const API_CHANGE_PASSWORD_URL = environment.apiUrl + 'authentication/change-password';

@Injectable()
export class UserProfileService {
	private currentUserSubject;
	public currentUser;

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}
	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	getUserProfile(): Observable<UserProfile> {
		return this.http.get<UserProfile>(API_USERS_INFO_URL)
		.pipe(map(user => {
			// login successful if there's a jwt token in the response
			if (user) {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.currentUserSubject.next(user);
			}

			return user;
		}));;
	}

	updateUserProfile(userProfile$: UserProfile) {
		return this.http.put<UserProfile>(API_USERS_INFO_URL, userProfile$);
	}

	changePassword(payload: ChangePassword): Observable<any> {
		return this.http.put<any>(API_CHANGE_PASSWORD_URL, payload);
	}
}
