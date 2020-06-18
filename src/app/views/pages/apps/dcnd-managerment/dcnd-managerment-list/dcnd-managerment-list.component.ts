import { AfterViewInit, AfterViewChecked, ViewEncapsulation } from '@angular/core';
// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay, filter } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription, from } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';

// Services
import { LayoutUtilsService, QueryParamsModel } from '../../../../../core/_base/crud';
// Models
import {
	Dcnd,
	DcndsDataSource,
	DcndsPageRequested,
	ProvinceRequested,
	DistrictRequested,
	WardRequested,
	currentProvince,
	currentDistrict,
	currentWard,
	Province,
	District,
	Ward,
	DcndDelete,
	DcndUpdate,
	DcndUpdated,
	selectUpdateError,
	selectUpdateSuccess,
	selectDeleteSuccess,
	selectDeleteError,
	DcndDeleted,
} from '../../../../../core/apps';
import { TranslateService } from '@ngx-translate/core';
import { MessageType, AddressEnum, DcndStatus } from '../../../../../shared';
// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-dcnd-managerment-list',
	templateUrl: './dcnd-managerment-list.component.html',
	styleUrls: ['./dcnd-managerment-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class DcndManagermentListComponent implements OnInit, OnDestroy {
	dataSource: DcndsDataSource;
	displayedColumns = [
		'select',
		'stt',
		'humanityCode',
		'humanityTitle',
		'humanityAddress',
		'humanityReceive',
		'createdBy',
		'statusCode',
		'actions',
	];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	selection = new SelectionModel<Dcnd>(true, []);
	pageNow;
	searchInput = '';
	dcndsResult: Dcnd[] = [];
	dcndStatusAll = [];
	provinceList = [];
	districtList = [];
	wardList = [];
	province;
	district;
	ward;
	dcndStatus;
	textRefuse;
	disabledDropdown = {};
	provinceSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'provinceId',
		labelKey: 'provinceName',
		position: 'top',
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT'),
	};
	districtSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'districtId',
		labelKey: 'districtName',
		position: 'top',
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT'),
	};
	wardSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'wardId',
		labelKey: 'wardName',
		position: 'top',
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT'),
	};
	statusSettings = {
		singleSelection: true,
		text: this.translate.instant('GENERAL.STATUS'),
		lazyLoading: false,
		showCheckbox: true,
		classes: 'delete-icon-remove',
		labelKey: 'dcndStatus',
	};
	// Subscriptions
	private subscriptions: Subscription[] = [];
	statusCode;
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
		private router: Router,
	) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */
	// tslint:disable: variable-name
	/**
	 * On init
	 */
	ngOnInit() {
		// Init DataSource
		this.dataSource = new DcndsDataSource(this.store);
		const entitiesSubscription = this.dataSource.entitySubject.pipe(skip(1), distinctUntilChanged()).subscribe((res) => {
			this.dcndsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First Load
		this.loadDcndsList();
		this.getAddressList(AddressEnum.Province);
		this.districtSettings.disabled = true;
		this.wardSettings.disabled = true;
		Object.entries(DcndStatus).forEach(([key, value]) => {
			const temp = { id: key, dcndStatus: this.translate.instant(value) };
			this.dcndStatusAll.push(temp);
		});
		this.dcndStatus = [{ id: 'ALL', dcndStatus: 'Tất cả' }];
	}

	ngOnDestroy() {
		this.subscriptions.forEach((el) => el.unsubscribe());
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
		this.loadDcndsList();
	}
	/**
	 * Load Dcnd list
	 */
	loadDcndsList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(this.filterConfiguration(), this.paginator.pageIndex, this.paginator.pageSize);
		this.pageNow = this.paginator.pageSize;
		this.store.dispatch(new DcndsPageRequested({ page: queryParams }));
	}
	/**
	 * Search
	 */
	search() {
		this.paginator.pageIndex = 0;
		this.loadDcndsList();
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
		if (this.province && this.province.length > 0) {
			filter.provinceId = this.province[0].provinceId;
		}
		if (this.district && this.district.length > 0) {
			filter.districtId = this.district[0].districtId;
		}
		if (this.ward && this.ward.length > 0) {
			filter.wardId = this.ward[0].wardId;
		}
		if (this.dcndStatus && this.dcndStatus.length > 0 && this.dcndStatus[0].id !== 'ALL') {
			filter.statusCode = this.dcndStatus[0].id;
		}
		filter.keyword = searchText;
		return filter;
	}
	/**
	 * Check all rows are selected
	 */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dcndsResult.length;
		return numSelected === numRows;
	}
	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.dcndsResult.length) {
			this.selection.clear();
		} else {
			this.dcndsResult.forEach((row) => this.selection.select(row));
		}
	}
	editDcnd(_item: Dcnd) {
		const urlEdit = 'dcnd-managerment/edit/' + _item.humanityId.toString();
		this.router.navigateByUrl(urlEdit);
	}
	verifyDcnd(_item: Dcnd) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.VERIFY')}`,
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.VERIFY')}`.toLowerCase(),
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.VERIFY');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const updateDcnd = new DcndUpdate();
			updateDcnd.humanityId = _item.humanityId;
			updateDcnd.statusCode = 'V';
			if (res.content) {
				updateDcnd.reason = res.content;
			} else {
				updateDcnd.reason = '';
			}
			this.store.dispatch(new DcndUpdated({ id: updateDcnd }));
			// tslint:disable: no-shadowed-variable
			this.store.pipe(select(selectUpdateError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectUpdateSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ACTION_SUCCESS', {
						action: `${this.translate.instant('ACTION.VERIFY')}`,
					});
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDcndsList();
				}
			});
		});
	}
	approveDcnd(_item: Dcnd) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.APPROVE')}`,
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.APPROVE')}`.toLowerCase(),
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.APPROVE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const updateDcnd = new DcndUpdate();
			updateDcnd.humanityId = _item.humanityId;
			updateDcnd.statusCode = 'A';
			if (res.content) {
				updateDcnd.reason = res.content;
			} else {
				updateDcnd.reason = '';
			}
			this.store.dispatch(new DcndUpdated({ id: updateDcnd }));
			// tslint:disable: no-shadowed-variable
			this.store.pipe(select(selectUpdateError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectUpdateSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ACTION_SUCCESS', {
						action: `${this.translate.instant('ACTION.APPROVE')}`,
					});
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDcndsList();
				}
			});
		});
	}
	refuseDcnd(_item: Dcnd) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.REFUSE')}`,
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.REFUSE')}`.toLowerCase(),
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.REFUSE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const updateDcnd = new DcndUpdate();
			updateDcnd.humanityId = _item.humanityId;
			updateDcnd.statusCode = 'R';
			if (res.content) {
				updateDcnd.reason = res.content;
			} else {
				updateDcnd.reason = '';
			}
			this.store.dispatch(new DcndUpdated({ id: updateDcnd }));
			// tslint:disable: no-shadowed-variable
			this.store.pipe(select(selectUpdateError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectUpdateSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ACTION_SUCCESS', {
						action: `${this.translate.instant('ACTION.REFUSE')}`,
					});
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDcndsList();
				}
			});
		});
	}
	spamDcnd(_item: Dcnd) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.SPAM')}`,
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.SPAM')}`.toLowerCase(),
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.SPAM');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const updateDcnd = new DcndUpdate();
			updateDcnd.humanityId = _item.humanityId;
			updateDcnd.statusCode = 'S';
			if (res.content) {
				updateDcnd.reason = res.content;
			} else {
				updateDcnd.reason = '';
			}
			this.store.dispatch(new DcndUpdated({ id: updateDcnd }));
			// tslint:disable: no-shadowed-variable
			this.store.pipe(select(selectUpdateError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectUpdateSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ACTION_SUCCESS', {
						action: `${this.translate.instant('ACTION.SPAM')}`,
					});
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDcndsList();
				}
			});
		});
	}
	createDcnd() {
		this.router.navigateByUrl('dcnd-managerment/create');
	}
	/**
	 * Delete Dcnd
	 *
	 * @param _item: Dcnd
	 */
	deleteDcnd(_item: Dcnd) {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`,
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`.toLowerCase(),
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _waitDesciption = this.translate.instant('TABLE.WAIT');
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const statusDcnd = new DcndDelete();
			statusDcnd.clear();
			statusDcnd.humanityIds.push(_item.humanityId);
			this.store.dispatch(new DcndDeleted({ id: statusDcnd }));
			// tslint:disable: no-shadowed-variable
			this.store.pipe(select(selectDeleteError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectDeleteSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.DELETE_SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDcndsList();
				}
			});
		});
	}
	/**
	 * Delete selected Dcnds
	 */
	deleteDcnds() {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`,
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translate.instant('ACTION.DELETE')}`.toLowerCase(),
			name: `${this.translate.instant('DCNDS.DCND')}`.toLowerCase(),
		});
		const _waitDesciption = this.translate.instant('TABLE.WAIT');
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			const statusDcnd = new DcndDelete();
			statusDcnd.clear();
			this.selection.selected.forEach((data) => {
				statusDcnd.humanityIds.push(data.humanityId);
			});
			this.store.dispatch(new DcndDeleted({ id: statusDcnd }));
			this.store.pipe(select(selectDeleteError)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.store.pipe(select(selectDeleteSuccess)).subscribe((res) => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.DELETE_SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.clearPagination();
					this.loadDcndsList();
				}
			});
		});
	}
	/**
	 * Retursn CSS Class Name by status
	 *
	 */
	// tslint:disable-next-line: no-shadowed-variable
	getItemCssClassByStatus(dcndStatus: string) {
		switch (dcndStatus) {
			case 'A':
				return 'success';
			case 'W':
				return 'info';
			case 'V':
				return 'default';
			case 'R':
				return 'danger';
			case 'S':
				return 'warning';
		}
		return '';
	}
	/**
	 * Returns Item Status in string
	 */
	// tslint:disable-next-line: no-shadowed-variable
	getItemStatusString(dcndStatus: string) {
		switch (dcndStatus) {
			case 'A':
				return `${this.translate.instant('STATUS_CODE.A')}`;
			case 'W':
				return `${this.translate.instant('STATUS_CODE.W')}`;
			case 'V':
				return `${this.translate.instant('STATUS_CODE.V')}`;
			case 'R':
				return `${this.translate.instant('STATUS_CODE.R')}`;
			case 'S':
				return `${this.translate.instant('STATUS_CODE.S')}`;
		}
		return `${this.translate.instant('STATUS_CODE.W')}`;
	}
	getAddressList(type: AddressEnum, input?: any) {
		switch (type) {
			case AddressEnum.Province:
				this.store.dispatch(new ProvinceRequested());
				this.store.pipe(select(currentProvince)).subscribe((result) => {
					this.provinceList = result;
				});
				break;
			case AddressEnum.District:
				if (!input) {
					break;
				}
				this.store.dispatch(new DistrictRequested({ provinceId: input }));
				this.store.pipe(select(currentDistrict)).subscribe((result) => {
					this.districtList = result;
				});
				break;
			case AddressEnum.Ward:
				if (!input) {
					break;
				}
				this.store.dispatch(new WardRequested({ districtId: input }));
				this.store.pipe(select(currentWard)).subscribe((result) => {
					this.wardList = result;
				});
				break;
			default:
				break;
		}
	}

	onItemSelect(inputValue: any, type?: string) {
		if (type === AddressEnum.Province) {
			const selectProvince = inputValue as Province;
			const settings = Object.assign({}, this.districtSettings);
			settings.disabled = false;
			this.districtSettings = settings;
			this.getAddressList(AddressEnum.District, selectProvince.provinceId);
			this.onDeSelectAll(AddressEnum.District);
		}

		if (type === AddressEnum.District) {
			const selectDistrict = inputValue as District;
			const settings = Object.assign({}, this.wardSettings);
			settings.disabled = false;
			this.wardSettings = settings;
			this.getAddressList(AddressEnum.Ward, selectDistrict.districtId);
			this.onDeSelectAll(AddressEnum.Ward);
		}

		if (type === AddressEnum.Ward) {
		}
	}

	onDeSelectAll(type: string) {
		if (type === AddressEnum.Province) {
			this.onDeSelectAll(AddressEnum.District);
			const settings = Object.assign({}, this.districtSettings);
			settings.disabled = true;
			this.districtSettings = settings;
			this.province = undefined;
		}
		if (type === AddressEnum.District) {
			this.onDeSelectAll(AddressEnum.Ward);
			const settings = Object.assign({}, this.wardSettings);
			settings.disabled = true;
			this.wardSettings = settings;
			this.district = undefined;
		}
		if (type === AddressEnum.Ward) {
			this.ward = undefined;
		}
	}
}
