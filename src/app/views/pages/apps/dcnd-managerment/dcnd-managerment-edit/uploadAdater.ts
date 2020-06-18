import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { FileUploadRequested, currentfile, FileUpload, fileUploadError } from '../../../../../core/apps';
import { DocumentType } from '../../../../../shared';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { TranslateService } from '@ngx-translate/core';

export class UploadAdapter {
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
				// this.sendFileUpload(data);
				// if (data.size <= 5000000) {
				const formData: FormData = new FormData();
				formData.append('type', DocumentType.HUMANITY_CONTENT);
				formData.append('file', data);
				this.store.dispatch(new FileUploadRequested({ body: formData }));
				this.store.pipe(select(currentfile)).subscribe(
					res => {
						if (res) {
							resolve({ default: res.link });
						}
					}
				);
				this.store.pipe(select(fileUploadError)).subscribe(res => {
					if (res) {
						reject(undefined);
					}
				});
				// } else {

				// 	console.log(reject(undefined));
				// }
			});
		});
		return upload;

	}

	//   public upload(): Promise<any> {
	//     return this.loader.file.then(
	//       (file) =>
	//         new Promise((resolve, reject) => {
	//           const myReader = new FileReader();
	//           myReader.onloadend = (e) => {
	//             resolve({ default: myReader.result });
	//           };
	//           myReader.readAsDataURL(file);
	//         }),
	//     );
	//   }
}
