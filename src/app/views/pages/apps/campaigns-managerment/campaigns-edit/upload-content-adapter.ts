import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { MessageType } from '../../../../../shared';
import { CampaignContentUpload } from '../../../../../core/apps/_actions/file-upload.actions';
import { selectCampaignContentUpload, selectCampaignContentUploadError } from '../../../../../core/apps/_selectors/file-upload.selectors';

export class UploadContentAdapter {
	constructor(
		private loader,
		private store: Store<AppState>,
	) {
		this.loader = loader;
		this.store = store;
	}

	sendFileUpload(file) {

	}

	upload() {
		const upload = new Promise((resolve, reject) => {
			this.loader.file.then((data) => {
				const formData: FormData = new FormData();
				formData.append('file', data);
				this.store.dispatch(new CampaignContentUpload({ body: formData }));
				this.store.pipe(select(selectCampaignContentUpload)).subscribe(
					res => {
						if (res) {
							resolve({ default: res.link });
						}
					}
				);
				this.store.pipe(select(selectCampaignContentUploadError)).subscribe(
					res => {
						if (res) {
							reject(false);
						}
					}
				);
			});
		});
		return upload;

	}
}
