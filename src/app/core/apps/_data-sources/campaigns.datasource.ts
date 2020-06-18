// RxJS
import { of } from 'rxjs';
import { catchError, finalize, tap, debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
// CRUD
import { BaseDataSource, QueryResultsModel } from '../../_base/crud';
// State
import { AppState } from '../../../core/reducers';
import { selectCampaignsInStore,
	selectCampaignsPageLoading,
	selectCampaignsShowInitWaitingMessage
} from '../_selectors/campaign.selectors';


export class CampaignsDataSource extends BaseDataSource {
	constructor(private store: Store<AppState>) {
		super();

		this.loading$ = this.store.pipe(
			select(selectCampaignsPageLoading)
		);

		this.isPreloadTextViewed$ = this.store.pipe(
			select(selectCampaignsShowInitWaitingMessage)
		);

		this.store.pipe(
			select(selectCampaignsInStore)
		).subscribe((response: QueryResultsModel) => {
			this.paginatorTotalSubject.next(response.totalCount);
			this.entitySubject.next(response.items);
		});
	}
}
