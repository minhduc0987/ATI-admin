import { ViewEncapsulation } from '@angular/core';
// Angular
import {
	Component,
	OnInit,
	ViewChild,
	ChangeDetectionStrategy,
	OnDestroy,
} from '@angular/core';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import {
	MatPaginator,
	MatDialog
} from '@angular/material';
// RXJS
import {
	distinctUntilChanged,
	tap,
	skip,
} from 'rxjs/operators';
import { merge, Subscription, from } from 'rxjs';
// LODASH
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Services
import {
	LayoutUtilsService,
	QueryParamsModel
} from '../../../../../core/_base/crud';
// Models
import {
	Donate,
	DonatesDataSource,
	DonatesPageRequested,
	DonatesStatus,
	DonateApprove,
	selectDonateApproveError,
	selectDonateApproveSuccess,
	DonateReject,
	selectDonateRejectError,
	selectDonateRejectSuccess,
	DonateSpam,
	selectDonateSpamError,
	selectDonateSpamSuccess,
} from '../../../../../core/apps';
import { TranslateService } from '@ngx-translate/core';
import { MessageType, DonateType, DonateStatus } from '../../../../../shared';
import { Router } from '@angular/router';
// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-donates-list',
	templateUrl: './donates-list.component.html',
	styleUrls: ['./donates-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class DonatesListComponent implements OnInit, OnDestroy {
	dataSource: DonatesDataSource;
	displayedColumns = [
		'stt',
		'fundId',
		'fundType',
		'fundName',
		'fundPrice',
		'fundStatus',
		'actions'
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	selection = new SelectionModel<Donate>(true, []);
	pageNow;
	startdate;
	enddate;
	searchInput = '';
	donateStatusAll = [];
	donateStatus;
	donateTypeAll = [];
	donateType;
	donatesResult: Donate[] = [];
	statusSettings = {
		singleSelection: true,
		text: this.translate.instant('GENERAL.STATUS'),
		lazyLoading: false,
		showCheckbox: true,
		classes: 'delete-icon-remove',
		labelKey: 'donateStatus'
	};
	typeSettings = {
		singleSelection: true,
		text: this.translate.instant('DONATES.TYPE'),
		lazyLoading: false,
		showCheckbox: true,
		classes: 'delete-icon-remove',
		labelKey: 'donateType'
	};
	// Subscriptions
	// private subscriptions: Subscription[] = [];
	subscription: Subscription = new Subscription();
	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private store: Store<AppState>,
		public dialog: MatDialog,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */
	// tslint:disable: variable-name
	/**
	 * On init
	 */
	ngOnInit() {
		this.pageNow = 10;
		const sortSubscription = this.paginator.page.subscribe(() => { this.loadDonatesList(); });
		this.subscription.add(sortSubscription);
		const paginatorSubscriptions = merge(
			this.paginator.page
		)
			.pipe(
				tap(() => {
					this.loadDonatesList();
				})
			)
			.subscribe();
		this.subscription.add(paginatorSubscriptions);

		// Init DataSource
		this.dataSource = new DonatesDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject
			.pipe(skip(1), distinctUntilChanged())
			.subscribe(res => {
				this.donatesResult = res;
			});
		this.subscription.add(entitiesSubscription);
		// First Load
		this.loadDonatesList();

		Object.entries(DonateStatus).forEach(([key, value]) => {
			const temp = { id: key, donateStatus: this.translate.instant(value)};
			this.donateStatusAll.push(temp);
		});
		this.donateStatus = [{ id: 'ALL', donateStatus: 'Tất cả' }];

		Object.entries(DonateType).forEach(([key, value]) => {
			const temp = { id: key, donateType: this.translate.instant(value)};
			this.donateTypeAll.push(temp);
		});
		this.donateType = [{ id: 'ALL', donateType: 'Tất cả' }];
	}
	setCode(data) {
		if (data.campaignCode !== null) {
			return data.campaignCode;
		}
		if (data.humanityCode !== null) {
			return data.humanityCode;
		}
	}
	getName(data) {
		if (data.campaignCode !== null) {
			return data.campaignName;
		}
		if (data.humanityCode !== null) {
			return data.humanityName;
		}
	}
	getType(data) {
		if (data.campaignCode !== null) {
			return this.translate.instant('DONATES.DONATE_TYPE.C');
		}
		if (data.humanityCode !== null) {
			return this.translate.instant('DONATES.DCND');
		}
	}
	formatNumber(n: any) {
		return n.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
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
		this.loadDonatesList();
	}
	/**
	 * Load Donate list
	 */
	loadDonatesList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.pageNow = this.paginator.pageSize;
		this.store.dispatch(new DonatesPageRequested({ page: queryParams }));
	}
	/**
	 * Search
	 */
	search() {
		this.paginator.pageIndex = 0;
		this.loadDonatesList();
	}
	clearPagination(): any {
		this.searchInput = '';
		this.paginator.pageIndex = 0;
	}
	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		// tslint:disable-next-line: no-shadowed-variable

		const filter: any = {};
		const searchText: string = this.searchInput;
		if (this.donateStatus && this.donateStatus.length > 0 && this.donateStatus[0].id !== 'ALL') {
			filter.fundStatus = this.donateStatus[0].id;
		}
		if (this.donateType && this.donateType.length > 0 && this.donateType[0].id !== 'ALL') {
			filter.type = this.donateType[0].id;
		}
		filter.keyword = searchText;
		return filter;
	}
	viewDonate(_item: Donate) {
		const urlNext = 'donates-managerment/view/' + _item.fundId.toString();
		this.router.navigateByUrl(urlNext);
	}
	approveDonate(_item: Donate) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.APPROVE')}`,
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.APPROVE')}`.toLowerCase(),
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.APPROVE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const appSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const changeStatusDonate = new DonatesStatus();
			changeStatusDonate.fundId = _item.fundId;
			if (res.content) {
				changeStatusDonate.rejectReson = res.content;
			} else {
				changeStatusDonate.rejectReson = '';
			}
			this.store.dispatch(new DonateApprove({ id: changeStatusDonate }));
			// tslint:disable: no-shadowed-variable
			const appFaiSub = this.store.pipe(select(selectDonateApproveError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(appFaiSub);
			const appSucSub = this.store.pipe(select(selectDonateApproveSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDonatesList();
				}
			});
			this.subscription.add(appSucSub);
		});
		this.subscription.add(appSub);
	}
	rejectDonate(_item: Donate) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.REFUSE')}`,
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.REFUSE')}`.toLowerCase(),
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.REFUSE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const rejSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const changeStatusDonate = new DonatesStatus();
			changeStatusDonate.fundId = _item.fundId;
			if (res.content) {
				changeStatusDonate.rejectReson = res.content;
			} else {
				changeStatusDonate.rejectReson = '';
			}
			this.store.dispatch(new DonateReject({ id: changeStatusDonate }));
			// tslint:disable: no-shadowed-variable
			const rejFaiSub = this.store.pipe(select(selectDonateRejectError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(rejFaiSub);
			const rejSucSub = this.store.pipe(select(selectDonateRejectSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDonatesList();
				}
			});
			this.subscription.add(rejSucSub);
		});
		this.subscription.add(rejSub);
	}
	spamDonate(_item: Donate) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.SPAM')}`,
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.SPAM')}`.toLowerCase(),
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.SPAM');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const spamSucSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const changeStatusDonate = new DonatesStatus();
			changeStatusDonate.fundId = _item.fundId;
			if (res.content) {
				changeStatusDonate.rejectReson = res.content;
			} else {
				changeStatusDonate.rejectReson = '';
			}
			this.store.dispatch(new DonateSpam({ id: changeStatusDonate }));
			// tslint:disable: no-shadowed-variable
			const spamFaiSub = this.store.pipe(select(selectDonateSpamError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(spamFaiSub);
			const spamSucSub = this.store.pipe(select(selectDonateSpamSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDonatesList();
				}
			});
			this.subscription.add(spamSucSub);
		});
		this.subscription.add(spamSucSub);
	}
	/**
	 * Retursn CSS Class Name by status
	 *
	 */
	// tslint:disable-next-line: no-shadowed-variable
	getItemCssClassByStatus(donateStatus: string) {
		switch (donateStatus) {
			case 'A':
				return 'success';
			case 'W':
				return 'info';
			case 'S':
				return 'warning';
			case 'R':
				return 'danger';
		}
		return '';
	}
	/**
	 * Returns Item Status in string
	 */
	// tslint:disable-next-line: no-shadowed-variable
	getItemStatusString(donateStatus: string) {
		switch (donateStatus) {
			case 'A':
				return `${this.translate.instant('STATUS_CODE.A')}`;
			case 'W':
				return `${this.translate.instant('STATUS_CODE.W')}`;
			case 'S':
				return `${this.translate.instant('STATUS_CODE.S')}`;
			case 'R':
				return `${this.translate.instant('STATUS_CODE.R')}`;
		}
		return `${this.translate.instant('STATUS_CODE.PENDING')}`;
	}
}
