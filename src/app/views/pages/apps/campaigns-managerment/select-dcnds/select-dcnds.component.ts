import { Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { AddressEnum } from '../../../../../shared';
import {
	ProvinceRequested,
	currentProvince,
	DistrictRequested,
	currentDistrict,
	WardRequested,
	currentWard,
	Province,
	District,
	Dcnd,
	DcndsPageRequested,
	CampaignSearchDcnds,
} from '../../../../../core/apps';
import {
	LayoutUtilsService,
	QueryParamsModel
} from '../../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { selectCurentDcnds, selectDcnds } from '../../../../../core/apps/_selectors/campaign.selectors';
import { isEmpty } from 'lodash';
import { CampaignLoadDcnds, CampaignLoadCurentDcnds } from '../../../../../core/apps/_actions/campaign.actions';

@Component({
	selector: 'kt-select-dcnds',
	templateUrl: './select-dcnds.component.html',
	styleUrls: ['./select-dcnds.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SelectDcndsComponent implements OnInit {
	selection = new SelectionModel<Dcnd>(true, []);
	provinceList = [];
	districtList = [];
	wardList = [];
	province;
	district;
	ward;
	searchInput;
	provinceTwo;
	districtTwo;
	wardTwo;
	searchInputTwo;
	dcnds: Dcnd[] = [];
	totalDcnds;
	totalDcndsCurent;
	dcndsCurent: Dcnd[] = [];
	pageIndex = 0;
	pageSize = 10;
	pageIndexCurent = 0;
	pageSizeCurent = 10;
	campaignId;
	@ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
	provinceSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'provinceId',
		labelKey: 'provinceName',
		position: 'top',
		maxHeight: 190,
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT')
	};
	districtSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'districtId',
		labelKey: 'districtName',
		position: 'top',
		maxHeight: 190,
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT')
	};
	wardSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'wardId',
		labelKey: 'wardName',
		position: 'top',
		maxHeight: 190,
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT')
	};
	provinceTwoSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'provinceId',
		labelKey: 'provinceName',
		position: 'top',
		maxHeight: 190,
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT')
	};
	districtTwoSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'districtId',
		labelKey: 'districtName',
		position: 'top',
		maxHeight: 190,
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT')
	};
	wardTwoSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'wardId',
		labelKey: 'wardName',
		position: 'top',
		maxHeight: 190,
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translate.instant('BUTTON.SEARCH'),
		noDataLabel: this.translate.instant('TABLE.NODATA'),
		text: this.translate.instant('DROPDOWN.DEFAULT')
	};
	constructor(
		private translate: TranslateService,
		private store: Store<AppState>,
	) {}

	ngOnInit() {
		this.getAddressList(AddressEnum.Province);
		this.districtSettings.disabled = true;
		this.wardSettings.disabled = true;
		this.districtTwoSettings.disabled = true;
		this.wardTwoSettings.disabled = true;

		this.loadDcndsList();
		this.loadDcndsTwoList();

		this.store.pipe(select(selectDcnds)).subscribe(res => {
			if (!isEmpty(res)) {
				this.dcndsCurent = res.dcnds;
				this.totalDcndsCurent = res.totalCount;
			}
		});

		this.store.pipe(select(selectCurentDcnds)).subscribe(res => {
			if (!isEmpty(res)) {
				this.dcnds = res.dcnds;
				this.totalDcnds = res.totalCount;
			}
		});
		console.log(this.dcnds);
	}

	loadDcndsList() {
		this.selection.clear();
		const queryParams = new CampaignSearchDcnds(
			this.campaignId = 0,
			this.filterConfiguration(),
			this.pageIndex,
			this.pageSize,
		);
		this.store.dispatch(new CampaignLoadDcnds({ page: queryParams }));
	}

	loadDcndsTwoList() {
		this.selection.clear();
		const queryParams = new CampaignSearchDcnds(
			this.campaignId = 0,
			this.filterTwoConfiguration(),
			this.pageIndexCurent,
			this.pageSizeCurent,
		);
		this.store.dispatch(new CampaignLoadCurentDcnds({ page: queryParams }));
	}

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
		filter.keyword = searchText;
		return filter;
	}

	filterTwoConfiguration(): any {
		// tslint:disable-next-line: no-shadowed-variable
		const filterTwo: any = {};
		const searchText: string = this.searchInputTwo;
		if (this.provinceTwo && this.provinceTwo.length > 0) {
			filterTwo.provinceId = this.provinceTwo[0].provinceId;
		}
		if (this.districtTwo && this.districtTwo.length > 0) {
			filterTwo.districtId = this.districtTwo[0].districtId;
		}
		if (this.wardTwo && this.wardTwo.length > 0) {
			filterTwo.wardId = this.wardTwo[0].wardId;
		}
		filterTwo.keyword = searchText;
		return filterTwo;
	}


	getAddressList(type: AddressEnum, input?: any) {
		switch (type) {
			case AddressEnum.Province:
				this.store.dispatch(new ProvinceRequested());
				this.store.pipe(select(currentProvince))
					.subscribe(result => {
						this.provinceList = result;
					});
				break;
			case AddressEnum.District:
				if (!input) { break; }
				this.store.dispatch(new DistrictRequested({ provinceId: input }));
				this.store.pipe(select(currentDistrict))
					.subscribe(result => {
						this.districtList = result;
					});
				break;
			case AddressEnum.Ward:
				if (!input) { break; }
				this.store.dispatch(new WardRequested({ districtId: input }));
				this.store.pipe(select(currentWard))
					.subscribe(result => {
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
			const settings = Object.assign({}, this.districtTwoSettings);
			settings.disabled = true;
			this.districtSettings = settings;
			this.province = undefined;
		}
		if (type === AddressEnum.District) {
			this.onDeSelectAll(AddressEnum.Ward);
			const settings = Object.assign({}, this.wardTwoSettings);
			settings.disabled = true;
			this.wardSettings = settings;
			this.district = undefined;
		}
		if (type === AddressEnum.Ward) {
			this.ward = undefined;
		}
	}

	onItemSelectTwo(inputValue: any, type?: string) {
		if (type === AddressEnum.Province) {
			const selectProvince = inputValue as Province;
			const settingsTwo = Object.assign({}, this.districtTwoSettings);
			settingsTwo.disabled = false;
			this.districtTwoSettings = settingsTwo;
			this.getAddressList(AddressEnum.District, selectProvince.provinceId);
			this.onDeSelectAllTwo(AddressEnum.District);
		}

		if (type === AddressEnum.District) {
			const selectDistrict = inputValue as District;
			const settingsTwo = Object.assign({}, this.wardTwoSettings);
			settingsTwo.disabled = false;
			this.wardTwoSettings = settingsTwo;
			this.getAddressList(AddressEnum.Ward, selectDistrict.districtId);
			this.onDeSelectAllTwo(AddressEnum.Ward);
		}

		if (type === AddressEnum.Ward) {
		}
	}

	onDeSelectAllTwo(type: string) {
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
