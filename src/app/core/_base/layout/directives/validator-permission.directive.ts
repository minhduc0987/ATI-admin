// Angular
import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// NGRX
import { Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState } from '../../../reducers';
import { currentUserProfile } from '../../../apps';

@Directive({
	selector: '[ktHasPermissions]'
})
export class ValidatorPermissionDirective implements OnInit, OnDestroy {
	// Public properties
	// @Input() ktHasPermissions: string;
	@Input() functionCode: string;
	@Input() serviceCode: string;
	private user$: Subscription;
	constructor(
		private elementRef: ElementRef,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		this.user$ = this.store.select(currentUserProfile).subscribe((user) => {
			if (user && user.roles) {
				let hasPermisson = false;
				const roles = user.roles;
				roles.forEach((role: any) => {
					const functions = role.functions;
					if (functions && functions.length > 0) {
						for (const fc of functions) {
							if (fc.functionCode === this.functionCode) {
								const services = fc.services;
								if (services && services.length > 0) {
									for (const sv of services) {
										if (sv.serviceCode === this.serviceCode) {
											hasPermisson = true;
											break;
										}
									}
								}
							}
						}
					}
				});
				if (!hasPermisson) {
					this.elementRef.nativeElement.remove();
				} else {
					this.elementRef.nativeElement.style.display = 'block';
				}
			} else {
				this.elementRef.nativeElement.style.display = 'none';
			}
		}, (err) => {
			this.elementRef.nativeElement.remove();
		});
	}

	ngOnDestroy() {
		this.user$.unsubscribe();
	}
}
