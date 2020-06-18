import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadContentAdapter } from './upload-content-adapter';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { DocumentType } from '../../../../../shared';

import {
	CampaignsEdit,
	CampaignCreated,
	HumanityFile,
	selectCampaignCreateSuccess,
	selectCampaignCreateError,
} from '../../../../../core/apps';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { SelectDcndsComponent } from '../select-dcnds/select-dcnds.component';
import { MatDialog } from '@angular/material';
import { MessageType } from '../../../../../shared';
import { UploadAvatarCampaign } from '../../../../../core/apps/_actions/file-upload.actions';
import { selectAvatarCampaignSuccess, selectAvatarCampaignError, selectCampaignContentUpload } from '../../../../../core/apps/_selectors/file-upload.selectors';
import { Router } from '@angular/router';

@Component({
	selector: 'kt-campaigns-edit',
	templateUrl: './campaigns-edit.component.html',
	styleUrls: ['./campaigns-edit.component.scss'],
	encapsulation: ViewEncapsulation.None
})
// tslint:disable: variable-name
// tslint:disable: quotemark
// tslint:disable: object-literal-key-quotes
export class CampaignsEditComponent implements OnInit, OnDestroy {
	// @ViewChild('avatarUploader', { static: false }) avatarUploader: ElementRef;
	campaign: CampaignsEdit;
	campaignForm: FormGroup;
	imagePath = null;
	imgURL: any;
	action: string;
	campaignImgList;
	campaignId: number;
	doneUploadImg = false;
	formErr = false;
	priceMin = false;
	priceMax = false;
	genderList = [];
	guarderList: HumanityFile[] = [];
	isGalleryDisable = false;
	create = false;
	public Editor = ClassicEditor;
	editorConfig = {
		placeholder: 'Nhập nội dung câu chuyện',
	};
	subscription: Subscription = new Subscription();
	regExFullname = '^[a-zA-Z_\'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$';
	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private store: Store<AppState>,
		private campaignFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		public dialog: MatDialog,
		private router: Router
	) {	}

	ngOnInit() {
		this.campaign = new CampaignsEdit();
		this.createForm();
	}
	ckUploadImage(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			return new UploadContentAdapter(loader, this.store);
		};
	}
	guarderUpload(event) {
		const imagePreviewCampaign = this.layoutUtilsService.imagePreviewCampaignDialog(
			this.action,
			'image/*',
			DocumentType.HUMANITY_REFER,
			this.campaignId,
			this.guarderList,
			this.isGalleryDisable
		);

		imagePreviewCampaign.afterClosed().subscribe((res: HumanityFile[]) => {
			if (res) {
				const data = [];
				res.forEach(e => {
					data.push(e.pathFileServer);
				});
				this.guarderList = res;
				this.campaignForm.controls['campaignDocument'].setValue(data);
			}
		});
	}
	createForm() {
		this.campaignForm = this.campaignFB.group({
			campaignProfile: [this.campaign.campaignProfile, Validators.required],
			campaignCode: [this.campaign.campaignCode],
			index_view: [this.campaign.index_view],
			title: [this.campaign.title,
				Validators.compose([
					Validators.required,
					Validators.minLength(30),
					Validators.maxLength(99),
				])
			],
			summary: [this.campaign.summary,
				Validators.compose([
					Validators.required,
					Validators.minLength(50),
					Validators.maxLength(150),
				])
			],
			content: [this.campaign.content,
				Validators.compose([
					Validators.required,
					Validators.minLength(100)
				])
			],
			requestDetails: [this.campaign.requestDetails],
			desiredValue: [this.campaign.desiredValue,
				Validators.compose([
					Validators.required,
				])
			],
			startDate: [this.campaign.startDate, Validators.required],
			endDate: [this.campaign.endDate, Validators.required],
			humanityIds: [this.campaign.humanityIds],
			campaignOrgDonate: [this.translate.instant('CAMPAIGNS.HCTDVN')],
			campaignDocument: []
		});
		this.campaignForm.controls['campaignCode'].disable();
		this.campaignForm.controls['campaignOrgDonate'].disable();
	}
	onSubmitForm() {
		if (this.campaignForm.value.desiredValue && (typeof this.campaignForm.value.desiredValue !== 'number')) {
			this.campaignForm.value.desiredValue = parseFloat(this.campaignForm.value.desiredValue.toString().replace(/\,/g, ''));
		}
		this.formErr = false;
		const controls = this.campaignForm.controls;
		/** check form */
		if (this.campaignForm.invalid) {
			this.formErr = true;
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		if (this.campaignForm.value.desiredValue) {
			const price = parseFloat(this.campaignForm.value.desiredValue.toString().replace(/\,/g, ''));
			if (price < 50000) {
				this.priceMin = true;
				this.formErr = true;
				return;
			} else {
				this.formErr = false;
				this.priceMin = false;
			}
			if (price >= 1000000000000) {
				this.formErr = true;
				this.priceMax = true;
				return;
			} else {
				this.formErr = false;
				this.priceMax = false;
			}
		}
		const formData = new FormData();
		if (this.imagePath) {
			formData.append('file', this.imagePath);
			this.store.dispatch(new UploadAvatarCampaign({ body: formData }));
			this.imagePath = null;
		}
		if (!this.doneUploadImg) {
			formData.append('file', this.imagePath);
			this.store.dispatch(new UploadAvatarCampaign({ body: formData }));
			this.imagePath = null;
			this.upImage();
			return;
		}
		this.createCampaign(this.campaignForm.value);
	}
	onChangeCurrency() {
		this.campaignForm.patchValue({
			desiredValue: this.formatNumber(this.campaignForm.value.desiredValue)
		});
	}
	formatNumber(n: any) {
		if (n !== null) {
			return n.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	}
	createCampaign(_campaign: CampaignsEdit) {
		this.store.pipe(select(selectCampaignContentUpload)).subscribe(res => {
			if (res) {
				const _Message = this.translate.instant('MESSAGE.ERROR');
				this.layoutUtilsService.showActionNotification(_Message, MessageType.Create);
				return;
			}
		});
		this.store.dispatch(new CampaignCreated({ campaign: _campaign }));
		this.store.pipe(select(selectCampaignCreateSuccess)).subscribe(res => {
			if (res) {
				const _Message = this.translate.instant('MESSAGE.SUCCESS');
				this.layoutUtilsService.showActionNotification(_Message, MessageType.Create);
				this.router.navigateByUrl('campaigns-managerment/list');
				return;
			}
		});
		this.store.pipe(select(selectCampaignCreateError)).subscribe(res => {
			if (res) {
				const _Message = this.translate.instant('MESSAGE.ERROR');
				this.layoutUtilsService.showActionNotification(_Message, MessageType.Create);
			}
		});
	}
	upImage() {
		const fileUpload = this.store.pipe(select(selectAvatarCampaignSuccess)).subscribe((res) => {
			if (res) {
				this.campaignForm.patchValue({
					campaignProfile: res.link
				});
				this.doneUploadImg = true;
				this.onSubmitForm();

			}
		});
		this.subscription.add(fileUpload);
		const subs = this.store.pipe(select(selectAvatarCampaignError)).subscribe((err) => {
			if (err) {
				this.doneUploadImg = false;
				if (err.error.returnMes) {
					this.layoutUtilsService.showCustomNotification(err.error.returnMes);
					return;
				}
				this.layoutUtilsService.showCustomNotification(err.message);
			}
		});
		this.subscription.add(subs);
	}
	uploadFile(event) {
		const files = event.target.files;
		if (files.length === 0) {
			return;
		}
		// this.avatarUploader.nativeElement.value = null;
		if (files[0].size <= 5000000) {
			const mimeType = files[0].type;
			if (mimeType.match(/image\/*/) == null) {
				return;
			}
			this.campaignForm.patchValue({
				campaignProfile: 'url'
			});
			this.renderPicture(files[0]);
			return;
		}
		this.layoutUtilsService.showCustomNotification(this.translate.instant('MESSAGE.IMG_TOO_BIG'), MessageType.Error);
		// this.avatarUploader.nativeElement.value = null;

	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	renderPicture(files) {
		const reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files);
		reader.onload = (event$) => {
			this.imgURL = reader.result;
			this.changeDetectorRef.detectChanges();
		};
		// this.avatarUploader.nativeElement.value = null;
	}

	selectDcnds() {
		const dialogRef = this.dialog.open(SelectDcndsComponent, {
			disableClose: true
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
		});
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.campaignForm.controls[controlName];
		if (!control) {
			return false;
		}
		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}
}
