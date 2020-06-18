import { Component, OnInit, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import {
	UserSpamDataSource,
	UserSpamsPageRequested,
	isDialogConfirmed,
	UserSpamUpdated,
	UserSpamUpdateModel,
	selectUserSpamUpdateSuccess,
	selectUserSpamUpdateError
} from '../../../../../core/apps';
import { MatPaginator, MatDialog, DateAdapter } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UserSpamModel } from '../../../../../core/apps';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, QueryParamsModel } from '../../../../../core/_base/crud';
import { Router, NavigationEnd } from '@angular/router';
import { skip, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Angular2MultiselectDropdown, singleSelectDropdownSettings, UserSpamEnum } from '../../../../../shared';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';

@Component({
	selector: 'kt-spam-list',
	templateUrl: './spam-list.component.html',
	styleUrls: ['./spam-list.component.scss']
})
export class SpamListComponent implements OnInit, OnDestroy, AfterContentInit {
	userSpamForm: FormGroup;

	dataSource: UserSpamDataSource;
	displayedColumns = [
		'stt',
		'userName',
		'email',
		'phoneNumber',
		'permittedFunctions',
		'permittedTime',
		'action'
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	selection = new SelectionModel<UserSpamModel>(true, []);
	pageNow;
	searchInput = '';
	userSpamResult: UserSpamModel[] = [];
	hasItem = false;
	maxDate = new Date();
	dialogRef;
	isDialogSubCall = false;
	userSpamTypeList = [];
	userType;
	startTime;
	endTime;
	spamTitle: string;
	userSpamTypeSettings: Angular2MultiselectDropdown;

	private subscriptions: Subscription[] = [];

	constructor(
		private store: Store<AppState>,
		public dialog: MatDialog,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private dateAdapter: DateAdapter<any>,
		private formBuilder: FormBuilder
	) {
		// this.router.events
		// 	.pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
		// 	.subscribe(event => {
		// 		console.log(event);
		// 		if (event.id === 1 && event.url === event.urlAfterRedirects) {
		// 			alert('hi');
		// 		}
		// 	});
		this.userSpamForm = this.formBuilder.group({
			startTime: new FormControl(null),
			endTime: new FormControl(null),
			userType: new FormControl(null),
			searchInput: new FormControl(null)
		}, { validators: this.isDateValid });
		this.spamTitle = this.translate.instant('USER.LOCK.TITLE');
	}

	isDateValid(group: AbstractControl): { isDateValid: boolean } {
		const endTime = group.get('endTime').value;
		const startTime = group.get('startTime').value;
		if (!endTime || !startTime) { return; }
		if (new Date(endTime) < new Date(startTime)) {
			return { isDateValid: true };
		}
	}
	ngOnInit() {
		// Init DataSource
		this.dataSource = new UserSpamDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject
			.pipe(skip(1), distinctUntilChanged())
			.subscribe(res => {
				this.userSpamResult = res;
				this.hasItem = false;

				// this.startTime = null;
				// this.endTime = null;
				// this.userType = null;
				// this.searchInput = null;

				if (res.length > 0) {
					this.hasItem = true;
				}
			});
		this.subscriptions.push(entitiesSubscription);
		this.dateAdapter.setLocale(this.translate.currentLang);

		const settings = singleSelectDropdownSettings;
		settings.noDataLabel = this.translate.instant(settings.noDataLabel);
		settings.text = this.translate.instant(settings.text);
		this.userSpamTypeSettings = settings;
		this.userSpamTypeList = [
			{
				id: UserSpamEnum.HUMANITY, value: this.translate.instant('USER.LOCK.TYPE.HUMANITY')
			},
			{
				id: UserSpamEnum.FUND_PLAN, value: this.translate.instant('USER.LOCK.TYPE.FUND_PLAN')
			},
			{
				id: UserSpamEnum.CAMPAIGN, value: this.translate.instant('USER.LOCK.TYPE.CAMPAIGN')
			}
		];




		// First Load
		this.loadUserSpamList();
		// this.getAddressList(AddressEnum.Province);
		// this.districtSettings.disabled = true;
		// this.wardSettings.disabled = true;
	}

	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	// tslint:disable-next-line: use-life-cycle-interface
	ngAfterContentInit() {
		this.pageNow = 10;
	}

	pageEvent(page) {
		if (this.pageNow !== page.pageSize) {
			this.paginator.pageIndex = 0;
		} else {
			this.paginator.pageIndex = page.pageIndex;
		}
		this.loadUserSpamList();
	}
	/**
	 * Load Dcnd list
	 */
	loadUserSpamList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.userSpamForm.value,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.pageNow = this.paginator.pageSize;
		this.store.dispatch(new UserSpamsPageRequested({ page: queryParams }));
	}
	/**
	 * Search
	 */
	search() {
		this.paginator.pageIndex = 0;
		this.loadUserSpamList();
	}
	clearPagination(): any {
		this.searchInput = '';
		this.paginator.pageIndex = 0;
	}

	clearDate(controlName) {
		this.userSpamForm.controls[controlName].reset();
	}
	/**
	 * Check all rows are selected
	 */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.userSpamResult.length;
		return numSelected === numRows;
	}
	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.userSpamResult.length) {
			this.selection.clear();
		} else {
			this.userSpamResult.forEach(row => this.selection.select(row));
		}
	}

	unlockUser(userSpam: UserSpamModel) {
		const payload = new UserSpamUpdateModel();
		payload.userId = userSpam.userId;
		payload.lockType = userSpam.lockType;

		this.dialogRef = this.layoutUtilsService.customeElement(
			this.translate.instant('MESSAGE.NOTIFICATION_MESSAGE'),
			this.translate.instant('MESSAGE.USER_UNLOCK_WARNING', { function: this.translate.instant('USER.LOCK.TYPE.' + userSpam.lockType) }),
			this.translate.instant('TABLE.WAIT'),
			this.translate.instant('BUTTON.CANCEL'),
			this.translate.instant('BUTTON.SAVE'));
		if (!this.isDialogSubCall) {
			this.store.pipe(select(isDialogConfirmed)).subscribe(res => {
				if (res) {
					this.store.dispatch(new UserSpamUpdated({ userSpamUpdate: payload }));

					// this.dialogRef.close();
				}
			});
			this.store.pipe(select(selectUserSpamUpdateSuccess)).subscribe(res => {
				if (res) {
					this.layoutUtilsService.showCustomNotification(this.translate.instant('MESSAGE.USER_UNLOCK_SUCCESS'));
					this.dialogRef.close();
					this.userSpamForm.reset();
					this.loadUserSpamList();
				}
			});
			this.store.pipe(select(selectUserSpamUpdateError)).subscribe((err: HttpErrorResponse) => {
				if (err) {
					this.dialogRef.close();
					if (err.error && err.error.returnMes) {
						this.layoutUtilsService.showCustomNotification(err.error);
						return;
					}
					this.layoutUtilsService.showCustomNotification(this.translate.instant('MESSAGE.ERROR'));
				}
			});
			this.isDialogSubCall = true;
		}
	}
}
