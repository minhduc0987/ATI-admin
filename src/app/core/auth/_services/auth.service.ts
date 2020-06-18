import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role, QueryParamsRoleModel } from '../_models/role.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const API_AUTHENTICATION_URL = environment.apiUrl + 'authentication/';
const API_LOGIN_URL = environment.apiUrl + 'authentication/login';
const API_USER_URL = environment.apiUrl + 'user/';
const API_PERMISSION_URL = environment.apiUrl + 'role/function';
const API_ROLES_URL = environment.apiUrl + 'role';

@Injectable()
export class AuthService {
	constructor(private http: HttpClient) {}
	// Authentication/Authorization

	login(username: string, password: string, type = 'ADMIN'): Observable<User> {
		return this.http.post<User>(API_LOGIN_URL, { username, password, type });
	}

	getUserByToken(): Observable<User> {
		return this.http.get<User>(API_USER_URL + 'info');
	}

	register(user: User): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http
			.post<User>(API_LOGIN_URL, user, { headers: httpHeaders })
			.pipe(
				map((res: User) => {
					return res;
				}),
				catchError((err) => {
					return null;
				}),
			);
	}

	/*
	 * Submit forgot password request
	 *
	 * @param {string} email
	 * @returns {Observable<any>}
	 */
	public requestPassword(email: string): Observable<any> {
		return this.http.get(API_AUTHENTICATION_URL + 'forgot-password?username=' + email);
	}
	getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(API_LOGIN_URL);
	}

	getUserById(userId: number): Observable<User> {
		return this.http.get<User>(API_LOGIN_URL + `/${userId}`);
	}

	// resetPassUser => resetPassUser the user from the server
	resetPassUser(userId: any) {
		const url = `${API_USER_URL + ''}`;
		return this.http.put(url, userId);
	}
	// DELETE => delete the user from the server
	deleteUser(userId: any) {
		const url = `${API_USER_URL + 'status'}`;
		return this.http.put(url, userId);
	}
	deleteUsers(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		// tslint:disable-next-line:prefer-const
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteUser(ids[i]));
		}
		return forkJoin(tasks$);
	}
	// UPDATE => PUT: update the user on the server
	updateUser(_user: User): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.put(API_USER_URL + 'info/' + _user.userId, _user, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<User>(API_AUTHENTICATION_URL + 'register', user, { headers: httpHeaders });
	}

	// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_USER_URL + 'search', queryParams, { headers: httpHeaders });
	}

	// Permission
	getAllPermissions(): Observable<Permission[]> {
		return this.http.get<Permission[]>(API_PERMISSION_URL);
	}

	getRolePermissions(roleId: number): Observable<Permission[]> {
		return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
	}

	// Roles
	// getAllRoles(): Observable<Role[]> {
	// 	return this.http.get<Role[]>(API_ROLES_URL);
	// }

	getRoleById(roleId: number): Observable<Role> {
		return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
	}

	// CREATE =>  POST: add a new role to the server
	createRole(role: Role): Observable<Role> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// UPDATE => PUT: update the role on the server
	updateRole(role: Role): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		const url = `${API_ROLES_URL}/${role.roleId}`;
		return this.http.put(url, role, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roles: any): Observable<any> {
		return this.http.put<any>(`${API_ROLES_URL}/`, roles);
	}

	// ROLED =>  POST: role users
	userRoleCheck(role: any): Observable<any> {
		console.log('service', role);
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<any>(`${API_ROLES_URL}/user/add`, role, { headers: httpHeaders });
	}

	// ROLED =>  POST: role users
	userRoleUnCheck(role: any): Observable<any> {
		return this.http.put<any>(`${API_ROLES_URL}/user/remove`, role);
	}

	// Check Role Before deletion
	isRoleAssignedToUsers(roleId: number): Observable<boolean> {
		return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
	}

	getRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		// This code imitates server calls
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<QueryResultsModel>(API_ROLES_URL + '/search', queryParams, { headers: httpHeaders });
	}

	getUsersRole(queryParams: QueryParamsRoleModel): Observable<any> {
		// This code imitates server calls
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<any>(API_ROLES_URL + '/user-role', queryParams, { headers: httpHeaders });
	}

	getUserProfile(): Observable<QueryResultsModel> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.get<QueryResultsModel>(API_LOGIN_URL + '/info', { headers: httpHeaders });
	}

	/*
	 * Handle Http operation that failed.
	 * Let the app continue.
	 *
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result);
		};
	}
}
