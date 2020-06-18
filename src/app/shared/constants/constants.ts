export const REFERENCE_TYPE = [
	{ value: 'Facebook' },
	{ value: 'Instagram' },
	{ value: 'LinkedIn' },
	{ value: 'Twitter' },
	{ value: 'Blog' },
	{ value: 'Website' }
];

export const singleSelectDropdownSettings = {
	disabled: false,
	singleSelection: true,
	enableCheckAll: false,
	showCheckbox: false,
	primaryKey: 'id',
	labelKey: 'value',
	noDataLabel: 'DROPDOWN.NODATA',
	text: 'DROPDOWN.DEFAULT',
};

export const filterSelectDropdownSettings = {
	disabled: false,
	singleSelection: true,
	enableCheckAll: false,
	showCheckbox: false,
	primaryKey: 'provinceId',
	labelKey: 'provinceName',
	enableSearchFilter: true,
	enableFilterSelectAll: false,
	searchPlaceholderText: 'BUTTON.SEARCH',
	noDataLabel: 'TABLE.NODATA',
	text: 'DROPDOWN.DEFAULT'
};
