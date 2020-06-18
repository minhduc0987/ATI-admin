// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
import { selectUserSpamsPageLoading, selectUserSpamsShowInitWaitingMessage, selectUserSpamsInStore } from '../_selectors/user-spam.selectors';


export class UserSpamDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(select(selectUserSpamsPageLoading));

		this.isPreloadTextViewed$ = this.store.pipe(select(selectUserSpamsShowInitWaitingMessage));

		this.store.pipe(select(selectUserSpamsInStore)).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
