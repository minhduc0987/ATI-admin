// NGRX
import { ActionReducerMap, MetaReducer, ActionReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { routerReducer } from '@ngrx/router-store';

import { environment } from '../../../environments/environment';

export function debug(
	reducer: ActionReducer<any>
): ActionReducer<any> {
	return (state, action) => {
		const newState = reducer(state, action);
		if (!(action.type && action.type.startsWith('@ngrx'))) {
			console.log(`[DEBUG] action: ${action.type}`, {
				payload: (action as any).payload,
				oldState: state,
				newState
			});
		}
		return newState;
	};
}

// tslint:disable-next-line:no-empty-interface
export interface AppState { }

export const reducers: ActionReducerMap<AppState> = { router: routerReducer };

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze, debug] : [];
