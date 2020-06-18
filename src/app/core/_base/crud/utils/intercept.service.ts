// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptService implements HttpInterceptor {
	constructor(private router: Router) {}
	// intercept request and add token
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// tslint:disable-next-line:no-debugger
		// modify request
		// request = request.clone({
		// 	setHeaders: {
		// 		Authorization: `Bearer ${localStorage.getItem(environment.authTokenKey)}`
		const userToken = localStorage.getItem(environment.authTokenKey);
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${userToken}`,
			},
		});
		// console.log('----request----');
		// console.log(request);
		// console.log('--- end of request---');

		return next.handle(request).pipe(
			tap(
				(event: HttpEvent<any>) => {
					if (event instanceof HttpResponse) {
						// console.log('all looks good');
						// http response status code
						// console.log(event.status);
					}
				},
				(error: any) => {
					// http response status code
					// console.log('----response----');
					// console.error('status code:');
					// tslint:disable-next-line:no-debugger
					// console.error(error.status);
					// console.error(error.message);
					// console.log('--- end of response---');
					if (error instanceof HttpErrorResponse) {
						if (error.status === 401) {
							localStorage.removeItem(environment.authTokenKey);
							this.router.navigateByUrl('/auth/login');
						}

						if (error.status <= 0) {
							console.log('error: ', error);
							return;
						}
					}
				},
			),
		);
	}
}
