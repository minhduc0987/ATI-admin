// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
import { selectDcndsInStore, selectDcndsPageLoading, selectDcndsShowInitWaitingMessage } from '../_selectors/dcnd.selectors';


export class DcndsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(select(selectDcndsPageLoading));

		this.isPreloadTextViewed$ = this.store.pipe(select(selectDcndsShowInitWaitingMessage));

		this.store.pipe(select(selectDcndsInStore)).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
