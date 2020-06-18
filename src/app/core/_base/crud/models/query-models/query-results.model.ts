export class QueryResultsModel {
	// fields
	items: any[];
	totalCount: number;
	errorMessage: string;
	pageNumber: number;
	pageSize: number;

	constructor(_items: any[] = [], _totalCount: number = 0, _errorMessage: string = '', _pageNumber: number = 0, _pageSize: number = 0) {
		this.items = _items;
		this.totalCount = _totalCount;
		this.pageNumber = _pageNumber;
		this.pageSize = _pageSize;
	}
}
