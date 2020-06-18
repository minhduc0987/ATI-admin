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
	Campaign,
	CampaignsDataSource,
	CampaignsPageRequested,
	CampaignDeleted,
	CampaignsDelete,
	selectCampaignsUpdateError,
	selectCampaignsUpdateSuccess,
	selectCampaignDeleteError,
	selectCampaignDeleteSuccess,
	CampaignsChangeStatus,
	CampaignStatus,
} from '../../../../../core/apps';
import { TranslateService } from '@ngx-translate/core';
import { campaignsStatus } from '../../../../../shared/enum/campaigns-status';
import { MessageType } from '../../../../../shared';
import { Router } from '@angular/router';
// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-campaigns-list',
	templateUrl: './campaigns-list.component.html',
	styleUrls: ['./campaigns-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class CampaignsListComponent implements OnInit, OnDestroy {
	dataSource: CampaignsDataSource;
	displayedColumns = [
		'select',
		'stt',
		'campaignCode',
		'campaignTitle',
		'createdBy',
		'statusCode',
		'actions'
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	selection = new SelectionModel<Campaign>(true, []);
	pageNow;
	startdate: Date;
	enddate: Date;
	searchInput = '';
	campaignStatusAll = [];
	campaignStatus;
	campaignsResult: Campaign[] = [];
	statusSettings = {
		singleSelection: true,
		text: this.translate.instant('GENERAL.STATUS'),
		lazyLoading: false,
		showCheckbox: true,
		classes: 'delete-icon-remove',
		labelKey: 'campaignStatus'
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
		const sortSubscription = this.paginator.page.subscribe(() => { this.loadCampaignsList(); });
		this.subscription.add(sortSubscription);
		const paginatorSubscriptions = merge(
			this.paginator.page
		)
			.pipe(
				tap(() => {
					this.loadCampaignsList();
				})
			)
			.subscribe();
		this.subscription.add(paginatorSubscriptions);

		// Init DataSource
		this.dataSource = new CampaignsDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject
			.pipe(skip(1), distinctUntilChanged())
			.subscribe(res => {
				this.campaignsResult = res;
			});
		this.subscription.add(entitiesSubscription);
		// First Load
		this.loadCampaignsList();
		Object.entries(campaignsStatus).forEach(([key, value]) => {
			const temp = { id: key, campaignStatus: this.translate.instant(value)};
			this.campaignStatusAll.push(temp);
		});
		this.campaignStatus = [{ id: 'ALL', campaignStatus: 'Tất cả' }];
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
		this.loadCampaignsList();
	}
	/**
	 * Load Campaign list
	 */
	loadCampaignsList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.pageNow = this.paginator.pageSize;
		this.store.dispatch(new CampaignsPageRequested({ page: queryParams }));
	}
	/**
	 * Search
	 */
	search() {
		this.paginator.pageIndex = 0;
		this.loadCampaignsList();
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
		if (this.campaignStatus && this.campaignStatus.length > 0 && this.campaignStatus[0].id !== 'ALL') {
			filter.statusCode = this.campaignStatus[0].id;
		}
		if (this.startdate) {
			filter.startDate = this.startdate.toISOString().split('T')[0];
		}
		if (this.enddate) {
			filter.endDate = this.enddate.toISOString().split('T')[0];
		}
		filter.keyword = searchText;
		return filter;
	}
	/**
	 * Check all rows are selected
	 */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.campaignsResult.length;
		return numSelected === numRows;
	}
	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.campaignsResult.length) {
			this.selection.clear();
		} else {
			this.campaignsResult.forEach(row => this.selection.select(row));
		}
	}
	createCampaign() {
		this.router.navigateByUrl('campaigns-managerment/create');
	}
	editCampaign(_item: Campaign) {
		const urlEdit = 'campaigns-managerment/edit/' + _item.campaignId.toString();
		this.router.navigateByUrl(urlEdit);
	}
	approveCampaign(_item: Campaign) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.APPROVE')}`,
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.APPROVE')}`.toLowerCase(),
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.APPROVE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const appSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const updateCampaign = new CampaignsChangeStatus();
			updateCampaign.campaignId = _item.campaignId;
			updateCampaign.statusCode = 'A';
			if (res.content) {
				updateCampaign.reason = res.content;
			}
			this.store.dispatch(new CampaignStatus({ id: updateCampaign }));
			// tslint:disable: no-shadowed-variable
			const appFaiSub = this.store.pipe(select(selectCampaignsUpdateError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(appFaiSub);
			const appSucSub = this.store.pipe(select(selectCampaignsUpdateSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadCampaignsList();
				}
			});
			this.subscription.add(appSucSub);
		});
		this.subscription.add(appSub);
	}
	refuseCampaign(_item: Campaign) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.REFUSE')}`,
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.REFUSE')}`.toLowerCase(),
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.REFUSE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const reSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const updateCampaign = new CampaignsChangeStatus();
			updateCampaign.campaignId = _item.campaignId;
			updateCampaign.statusCode = 'R';
			if (res.content) {
				updateCampaign.reason = res.content;
			}
			this.store.dispatch(new CampaignStatus({ id: updateCampaign }));
			// tslint:disable: no-shadowed-variable
			const reFaiSub = this.store.pipe(select(selectCampaignsUpdateError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(reFaiSub);
			const reSucSub = this.store.pipe(select(selectCampaignsUpdateSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadCampaignsList();
				}
			});
			this.subscription.add(reSucSub);
		});
		this.subscription.add(reSub);
	}
	deleteCampaign(_item: Campaign) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.DELETE')}`,
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.DELETE')}`.toLowerCase(),
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _waitDesciption = this.translate.instant('TABLE.WAIT');
		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption,
		);
		const deSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const statusCampaign = new CampaignsDelete();
			statusCampaign.clear();
			statusCampaign.campaignIds.push(_item.campaignId);
			this.store.dispatch(new CampaignDeleted({ id: statusCampaign }));
			// tslint:disable: no-shadowed-variable
			const deFaiSub = this.store.pipe(select(selectCampaignDeleteError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(deFaiSub);
			const deSucSub = this.store.pipe(select(selectCampaignDeleteSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.DELETE_SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadCampaignsList();
				}
			});
			this.subscription.add(deSucSub);
		});
		this.subscription.add(deSub);
	}
	/**
	 * Delete selected Campaigns
	 */
	deleteCampaigns() {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.DELETE')}`,
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.DELETE')}`.toLowerCase(),
				name: `${this.translate.instant('CAMPAIGNS.CAMPAIGN')}`.toLowerCase()
			});
		const _waitDesciption = this.translate.instant('TABLE.WAIT');
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		const deSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const statusCampaign = new CampaignsDelete();
			statusCampaign.clear();
			this.selection.selected.forEach(data => {
				statusCampaign.campaignIds.push(data.campaignId);
			});
			this.store.dispatch(new CampaignDeleted({ id: statusCampaign }));
			const deFaiSub = this.store.pipe(select(selectCampaignDeleteError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(deFaiSub);
			const deSucSub = this.store.pipe(select(selectCampaignDeleteSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.DELETE_SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadCampaignsList();
				}
			});
			this.subscription.add(deSucSub);
		});
		this.subscription.add(deSub);
	}
	/**
	 * Retursn CSS Class Name by status
	 *
	 */
	// tslint:disable-next-line: no-shadowed-variable
	getItemCssClassByStatus(campaignStatus: string) {
		switch (campaignStatus) {
			case 'A':
				return 'success';
			case 'W':
				return 'info';
			case 'R':
				return 'danger';
		}
		return '';
	}
	/**
	 * Returns Item Status in string
	 */
	// tslint:disable-next-line: no-shadowed-variable
	getItemStatusString(campaignStatus: string) {
		switch (campaignStatus) {
			case 'A':
				return `${this.translate.instant('STATUS_CODE.A')}`;
			case 'W':
				return `${this.translate.instant('STATUS_CODE.W')}`;
			case 'R':
				return `${this.translate.instant('STATUS_CODE.R')}`;
		}
		return `${this.translate.instant('STATUS_CODE.W')}`;
	}
}
