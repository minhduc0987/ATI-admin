// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
import { selectDonatesInStore, selectDonatesPageLoading, selectDonatesShowInitWaitingMessage } from '../_selectors/donate.selectors';


export class DonatesDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectDonatesPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectDonatesShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectDonatesInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
