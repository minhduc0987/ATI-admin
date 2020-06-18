import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import {
	GenderEnum,
	AddressEnum,
	singleSelectDropdownSettings,
	filterSelectDropdownSettings,
	Angular2MultiselectDropdown,
	MessageType,
	BankInfoEnum,
} from '../../../../../shared';
import {
	// Model
	Province,
	District,
	DcndEdit,

	// Selectors
	currentProvince,
	currentDistrict,
	currentWard,

	// Actions
	ProvinceRequested,
	DistrictRequested,
	WardRequested,
	DcndOnServerCreated,
	isDcndCreated,
	selectDcndRequestedError,
	FileUploadRequested,
	fileUploadError,
	currentfile,
	DcndLoadRequested,
	selectCurrentDcnd,
	selectDcndLoadedError,
	isDcndUpdated,
	DcndOnServerUpdated,
	selectUpdateError,
	selectUpdateSuccess,
	DcndUpdate,
	DcndUpdated,
	HumanityFile,
	DeleteFileTempRequested,
	DcndIndexViewRequested,
	selectAddressError,
	Dcnd,
} from '../../../../../core/apps';
import { AppState } from '../../../../../core/reducers';
import { Store, select } from '@ngrx/store';
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { DateAdapter } from '@angular/material/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { UploadAdapter } from './uploadAdater';
import { DocumentType } from '../../../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { Location } from '@angular/common';

@Component({
	selector: 'kt-dcnd-managerment-edit',
	templateUrl: './dcnd-managerment-edit.component.html',
	styleUrls: ['./dcnd-managerment-edit.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

export class DcndManagermentEditComponent implements OnInit, OnDestroy {
	@ViewChild('avatarUploader', { static: false }) avatarUploader: ElementRef;
	isLoaded = false;
	title: string;
	guardTitle: string;
	infoTitle: string;
	bankInfo: string;
	dcndVerifyTitle: string;
	generalInfoTitle: string;
	galeryInfoTitle: string;
	statusInfo: string;

	maxDate = new Date();
	editorData = null;
	humanityId: number;
	dcndForm: FormGroup;
	action: string;
	statusCode: string;
	bankValidator = false;
	districtData = null;
	wardData = null;
	isSave = false;
	viewLoading = true;
	isSubmitDisabled = false;
	isGalleryDisable = false;

	verifyType: string;
	verifyStatusCode: string;

	historyList = [];
	guarderList: HumanityFile[] = [];
	guarderListSave: HumanityFile[] = [];
	humanityList: HumanityFile[] = [];
	humanityListSave: HumanityFile[] = [];

	genderSettings: any;
	provinceSettings: Angular2MultiselectDropdown;
	districtSettings: Angular2MultiselectDropdown;
	wardSettings: Angular2MultiselectDropdown;
	bankNameSettings: Angular2MultiselectDropdown;
	bankBranchSettings: Angular2MultiselectDropdown;

	genderList = [];
	provinceList = [];
	districtList = [];
	wardList = [];
	bankNameList = [{ bankNameId: 1, bankName: 'Ngân hàng quân đội MB Bank' }];
	bankBranchList = [];

	isEditCall = false;
	isVerifyCall = false;
	isUploadCall = false;
	isCKUpload = false;

	imagePath = null;
	imgURL: any;
	isCalled = false;
	regexFullname =
		'^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽếềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$';

	/**
	 * CKEditor
	 *
	 */
	public Editor = ClassicEditor;
	editorConfig = {
		// plugins: [],
		placeholder: 'Hãy ghi câu chuyện nhân đạo ở đây....',
		// extraPlugins: [this.ckUploadImage]
	};

	// subscription: Subscription[] = [];
	subscription: Subscription = new Subscription();
	/** Component constructor
	 *
	 * @param translateService: TranslateService
	 * @param dncd: FormBuilder
	 * @param store: Store<AppState>
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param dateAdapter: DateAdapter<any>
	 */
	constructor(
		private translateService: TranslateService,
		private dncd: FormBuilder,
		private store: Store<AppState>,
		private layoutUtilsService: LayoutUtilsService,
		private dateAdapter: DateAdapter<any>,
		private changeDetectorRef: ChangeDetectorRef,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private el: ElementRef
	) {
		this.action = this.route.snapshot.paramMap.get('action');
		if (this.action === 'create') {
			// this.initDcndForm();
			this.createForm(new DcndEdit());
			this.title = `${this.translateService.instant('BUTTON.ADD')} ${this.translateService.instant('DCND.TITLE')}`;
			this.viewLoading = false;
			this.isLoaded = true;
			this.dcndForm.controls.bankName.setValue(this.bankNameList);
			return;
		}
		if (this.action === 'edit') {
			const id = this.route.snapshot.paramMap.get('id');
			this.humanityId = parseInt(id, 10);
			if (this.humanityId) {
				this.title = `${this.translateService.instant('ACTION.EDIT')} ${this.translateService.instant('DCND.TITLE')}`;
				this.store.dispatch(new DcndLoadRequested({ humanityId: this.humanityId }));
				return;
			}
		}
		this.isSave = true;
		this.router.navigateByUrl('/dcnd-managerment/list');

		// if (!this.isUploadCall) {
		// 	this.isUploadCall = true;
		// }
		// this.location.back();
	}

	ckUploadImage(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			this.isCKUpload = true;
			return new UploadAdapter(loader, this.store);
		};
	}
	ngOnInit() {
		const settings = singleSelectDropdownSettings;
		settings.noDataLabel = this.translateService.instant(singleSelectDropdownSettings.noDataLabel);
		settings.text = this.translateService.instant(singleSelectDropdownSettings.text);
		settings.disabled = false;
		this.genderSettings = settings;
		this.genderList = this.generateListByEnum(GenderEnum);

		this.getAddressList(AddressEnum.Province);
		this.provinceSettings = this.createDropDownSettings();
		this.districtSettings = this.createDropDownSettings(AddressEnum.District, true);
		this.wardSettings = this.createDropDownSettings(AddressEnum.Ward, true);
		this.bankNameSettings = this.createDropDownSettings(BankInfoEnum.BANK_NAME, true);
		this.bankBranchSettings = this.createDropDownSettings(BankInfoEnum.BANK_BRANCH, true);

		this.bankBranchList = [
			{ bankBranchId: 1, brandName: 'Chi nhánh Xã Đàn' }
		];
		// DateTimePicker
		this.dateAdapter.setLocale(this.translateService.currentLang);

		// Group Title
		this.statusInfo = `${this.translateService.instant('DCND.STATUS_INFO')}`;
		this.generalInfoTitle = `${this.translateService.instant('DCND.TITLE')}`;
		this.guardTitle = `${this.translateService.instant('DCND.GUARD_TITLE')}`;
		this.infoTitle = `${this.translateService.instant('DCND.INFO_TITLE')}`;
		this.bankInfo = this.translateService.instant('DCND.BANK.TITLE');
		this.dcndVerifyTitle = this.translateService.instant('DCND.VERIFY');
		this.galeryInfoTitle = this.translateService.instant('DCND.GALERY');
		this.getDcndSubcription();
		this.addressSubcription();
		this.fileUploadSubcription();

	}

	ngOnDestroy() {
		if (!this.isSave) {
			const humanityDeleteList: string[] = this.getListDelete(this.humanityListSave, this.humanityList);
			const guarderDeleteList: string[] = this.getListDelete(this.guarderListSave, this.guarderList);
			const links = humanityDeleteList.concat(guarderDeleteList);
			if (links.length > 0) {
				this.store.dispatch(new DeleteFileTempRequested({
					listLink: links
				}));
			}
		}
		this.subscription.unsubscribe();
	}

	getHistoryList(dcnd: DcndEdit) {
		const tableList = [];
		if (dcnd.createdDate) {
			tableList.push({
				affectedBy: dcnd.createdBy,
				affectedDate: dcnd.createdDate,
				status: this.translateService.instant('ACTION.CREATE'),
			});
		}
		if (dcnd.updatedDate) {
			tableList.push({
				affectedBy: dcnd.updatedBy,
				affectedDate: dcnd.updatedDate,
				status: this.translateService.instant('ACTION.EDIT'),
			});
		}
		if (dcnd.approvedDate) {
			tableList.push({
				affectedBy: dcnd.approvedBy,
				affectedDate: dcnd.approvedDate,
				status: this.translateService.instant('ACTION.APPROVE'),
				reason: dcnd.approvedReason
			});
		}
		if (dcnd.verifiedDate) {
			tableList.push({
				affectedBy: dcnd.verifiedBy,
				affectedDate: dcnd.verifiedDate,
				status: this.translateService.instant('ACTION.VERIFY'),
				reason: dcnd.verifiedReason
			});
		}
		if (dcnd.rejectDate) {
			tableList.push({
				affectedBy: dcnd.rejectBy,
				affectedDate: dcnd.rejectDate,
				status: this.translateService.instant('ACTION.REFUSE'),
				reason: dcnd.rejectReason
			});
		}
		return tableList.sort((a, b) => new Date(a.affectedDate).getTime() - new Date(b.affectedDate).getTime());
	}

	getListDelete(listSaveInput: HumanityFile[], listInput: HumanityFile[]): any[] {
		const listSave: string[] = [];
		listSaveInput.map(x => {
			listSave.push(x.pathFileServer);
		});

		const list: string[] = [];
		listInput.map(x => {
			list.push(x.pathFileServer);
		});
		const humanity: string[] = list.filter(x => {
			if (!listSave.includes(x)) {
				return x;
			}
		});
		return humanity;
	}

	updateDcndSubcription() {
		// DCND Update Subcription
		const dcndUpdate = this.store.pipe(select(isDcndUpdated)).subscribe((dcnd) => {
			if (dcnd) {
				this.isSubmitDisabled = false;
				this.viewLoading = false;
				this.isSave = true;
				if (this.verifyType && this.verifyStatusCode) {
					this.dcndVerify(this.verifyType, this.verifyStatusCode);
					this.verifyType = null;
					this.verifyStatusCode = null;
				} else {
					this.router.navigateByUrl('/dcnd-managerment/list');
					// this.location.back();
					this.layoutUtilsService.showCustomNotification(this.translateService.instant('MESSAGE.EDIT_SUCCESS'));
				}
				this.changeDetectorRef.detectChanges();
			}
		});
		this.subscription.add(dcndUpdate);
		// ---------------------------------- End DCND Create Error Subcription
	}



	createDcndSubcription() {
		// DCND Create Subcription
		const dcndCreate = this.store.pipe(select(isDcndCreated)).subscribe((dcnd) => {
			if (dcnd) {
				this.layoutUtilsService.showCustomNotification(this.translateService.instant('MESSAGE.SUCCESS'));
				this.isSave = true;
				this.router.navigateByUrl('/dcnd-managerment/list');
				// this.location.back();
				this.isSubmitDisabled = false;
				this.viewLoading = false;
				this.changeDetectorRef.detectChanges();
			}
		});
		this.subscription.add(dcndCreate);

		// ---------------------------------- End DCND Create Error Subcription
	}

	getDcndSubcription() {
		// DCND Get Data Subcription
		if (this.humanityId) {
			const humanity = this.store.pipe(select(selectCurrentDcnd)).subscribe((res) => {
				if (res) {
					this.statusCode = res.statusCode;
					if (res.statusCode === 'R') {
						this.isSubmitDisabled = true;
					}
					if (res.statusCode === 'A') {
						this.isGalleryDisable = true;
					}
					// this.initDcndForm();
					this.createForm(res);
					this.viewLoading = false;
					this.isLoaded = true;
					this.dcndForm.controls.bankName.setValue(this.bankNameList);
					// this.dcndFormPatchValue(res);
					this.historyList = this.getHistoryList(res);
				}
			});
			this.subscription.add(humanity);
		}

		// DCND Get Data Error Subcription
		const loadErr = this.store.pipe(select(selectDcndLoadedError)).subscribe((res) => {
			if (res) {
				this.viewLoading = false;
				this.isSubmitDisabled = false;
				this.router.navigateByUrl('/dcnd-managerment/list');
				if (res.error.returnMes) {
					this.layoutUtilsService.showCustomNotification(res.error.returnMes);
				} else {
					this.layoutUtilsService.showCustomNotification(res.message);
				}
				// this.location.back();
			}
		});
		this.subscription.add(loadErr);
		// ---------------------------------- End DCND Get Data Error Subcription
	}

	verifySubcription() {
		// DCND Verify Subcription
		this.subscription.add(
			this.store.pipe(select(selectUpdateError)).subscribe((res) => {
				if (res) {
					this.isSubmitDisabled = false;
					this.viewLoading = false;
					this.layoutUtilsService.showCustomNotification(res.error.returnMes, MessageType.Delete);
					this.verifyStatusCode = null;
					this.verifyType = null;
					this.clearBankValidation();
				}
			}),
		);
		this.subscription.add(
			this.store.pipe(select(selectUpdateSuccess)).subscribe((res) => {
				if (res) {
					this.verifyStatusCode = null;
					this.verifyType = null;
					this.layoutUtilsService.showCustomNotification(this.translateService.instant('MESSAGE.SUCCESS'), MessageType.Delete);
					this.router.navigateByUrl('/dcnd-managerment/list');
					this.clearBankValidation();
				}
			}),
		);
	}

	fileUploadSubcription() {
		// DCND File Upload Avatar Subcription
		const fileUpload = this.store.pipe(select(currentfile)).subscribe((res) => {
			if (res) {
				if (!this.isCKUpload) {
					const DCND = this.createPayload(res.link);
					if (this.action === 'create') {
						this.store.dispatch(new DcndOnServerCreated({ dcnd: DCND }));
					} else {
						this.store.dispatch(new DcndOnServerUpdated({ dcnd: DCND }));
					}
				}
			}
		});
		this.subscription.add(fileUpload);

		const subs = this.store.pipe(select(fileUploadError)).subscribe((err) => {
			if (err) {
				this.viewLoading = false;
				this.isSubmitDisabled = false;
				if (err.error.returnMes) {
					this.layoutUtilsService.showCustomNotification(err.error.returnMes);
					return;
				}
				this.layoutUtilsService.showCustomNotification(err.message);
			}
		});
		this.subscription.add(subs);
		// ---------------------------------- End DCND File Upload Avatar Subcription
	}

	addressSubcription() {
		// Address Subcription
		const province = this.store.pipe(select(currentProvince)).subscribe((result) => {
			if (result) {
				this.provinceList = result;
				this.changeDetectorRef.detectChanges();
			}
		});
		this.subscription.add(province);

		const district = this.store.pipe(select(currentDistrict)).subscribe((result) => {
			if (result) {
				this.districtList = result;
				if (this.districtData) {
					this.dcndForm.patchValue({
						district: [this.districtData],
					});
				}
				this.changeDetectorRef.detectChanges();
			}
		});
		this.subscription.add(district);
		const ward = this.store.pipe(select(currentWard)).subscribe((result) => {
			if (result) {
				this.wardList = result;
				if (this.wardData) {
					this.dcndForm.patchValue({
						ward: [this.wardData],
					});
				}
				this.changeDetectorRef.detectChanges();
			}
		});
		this.subscription.add(ward);
		// ---------------------------------- End Address Subcription
		this.subscription.add(this.store.pipe(select(selectAddressError)).subscribe(error => {
			if (error) {
				this.layoutUtilsService.showCustomNotification(this.translateService.instant('MESSAGE.ADDRESS_ERROR'));
			}
		}));
	}

	isLinkInclude(regex: RegExp): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			if (regex.test(control.value)) {
				return { isLinkInclude: true };
			}
		};
	}
	isDateValid(group: AbstractControl): { dateNotValid: boolean } {
		const date = group.get('dob');
		if (!date) {
			return;
		}

		const today = Date.now();
		if (date.value > today) {
			return { dateNotValid: true };
		}
	}

	generateListByEnum(value: any): any[] {
		const outputList = [];
		const properties = Object.getOwnPropertyNames(value);
		properties.map((item) => {
			outputList.push({
				id: item,
				value: this.translateService.instant(value[item]),
			});
		});
		return outputList;
	}

	createDropDownSettings(type?: any, isDisabled?: boolean, primaryKey?: string, labelKey?: string) {
		const settings = Object.assign({}, filterSelectDropdownSettings);
		settings.disabled = false;
		if (type && type === AddressEnum.District) {
			settings.disabled = isDisabled;
			settings.labelKey = 'districtName';
			settings.primaryKey = 'districtId';
		}
		if (type && type === AddressEnum.Ward) {
			settings.disabled = isDisabled;
			settings.labelKey = 'wardName';
			settings.primaryKey = 'wardId';
		}
		if (type && type === BankInfoEnum.BANK_NAME) {
			settings.disabled = isDisabled;
			settings.labelKey = 'bankName';
			settings.primaryKey = 'bankNameId';
		}
		if (type && type === BankInfoEnum.BANK_BRANCH) {
			settings.disabled = isDisabled;
			settings.labelKey = 'brandName';
			settings.primaryKey = 'bankBranchId';
		}
		settings.noDataLabel = this.translateService.instant(filterSelectDropdownSettings.noDataLabel);
		settings.text = this.translateService.instant(filterSelectDropdownSettings.text);
		settings.searchPlaceholderText = this.translateService.instant(filterSelectDropdownSettings.searchPlaceholderText);
		return settings;
	}

	/** Dropdown Item Select
	 *
	 * @param inputValue: any
	 * @param type?: string
	 *
	 */
	onItemSelect(inputValue: any, type?: string) {
		if (type === BankInfoEnum.BANK_NAME) {
			const selectBankName = inputValue;
			// this.bankBranchSettings = this.createDropDownSettings(BankInfoEnum.BANK_BRANCH, false);
		}
		if (type === BankInfoEnum.BANK_BRANCH) {
			const selectBankBranch = inputValue;
			this.dcndForm.controls['accountNumber'].enable();
		}
		if (type === AddressEnum.Province) {
			this.districtData = null;
			const selectProvince = inputValue as Province;
			this.districtSettings = this.createDropDownSettings(AddressEnum.District, false);
			this.getAddressList(AddressEnum.District, selectProvince.provinceId);
			this.onDeSelectAll(AddressEnum.District);
		}

		if (type === AddressEnum.District) {
			this.wardData = null;
			const selectDistrict = inputValue as District;
			this.wardSettings = this.createDropDownSettings(AddressEnum.Ward, false);
			this.getAddressList(AddressEnum.Ward, selectDistrict.districtId);
			this.onDeSelectAll(AddressEnum.Ward);
		}

		if (type === AddressEnum.Ward) {
		}
	}

	/** Dropdown Clear All
	 *
	 * @param type: string
	 *
	 */
	onDeSelectAll(type: string) {
		this.dcndForm.controls[type].reset();
		if (type === AddressEnum.Province) {
			this.onDeSelectAll(AddressEnum.District);
			this.districtSettings = this.createDropDownSettings(AddressEnum.District, true);
		}
		if (type === AddressEnum.District) {
			this.onDeSelectAll(AddressEnum.Ward);
			this.wardSettings = this.createDropDownSettings(AddressEnum.Ward, true);
		}
		// if (type === BankInfoEnum.BANK_BRANCH) {
		// 	this.dcndForm.controls['accountNumber'].reset();
		// 	this.dcndForm.controls['accountNumber'].disable();
		// }
	}

	/** Dropdown Item Select
	 *
	 * @param type: string
	 * @param input?: any
	 *
	 */
	getAddressList(type: AddressEnum, input?: any, value?: any) {
		switch (type) {
			case AddressEnum.Province:
				this.store.dispatch(new ProvinceRequested());
				break;
			case AddressEnum.District:
				if (!input) {
					break;
				}
				this.store.dispatch(new DistrictRequested({ provinceId: input }));
				break;
			case AddressEnum.Ward:
				if (!input) {
					break;
				}
				this.store.dispatch(new WardRequested({ districtId: input }));
				break;
			default:
				break;
		}
	}
	callFocus() {
		// console.log(this.el.nativeElement);
		const invalidControl = this.el.nativeElement.querySelector('.is-invalid');
		// console.log(invalidControl);
		if (invalidControl) {
			invalidControl.focus();
		}
	}

	onSubmit() {
		this.viewLoading = true;
		this.isSubmitDisabled = true;
		const controls = this.dcndForm.controls;
		if (this.dcndForm.invalid) {
			this.viewLoading = false;
			this.isSubmitDisabled = false;
			this.dcndForm.markAllAsTouched();
			this.changeDetectorRef.detectChanges();
			this.callFocus();
			return;
		}
		const formData = new FormData();
		if (this.imagePath) {
			this.isCKUpload = false;
			formData.append('type', DocumentType.HUMANITY_PROFILE);
			formData.append('file', this.imagePath);
			this.store.dispatch(new FileUploadRequested({ body: formData }));

		} else {
			const DCND = this.createPayload(null);
			if (this.statusCode === 'A') {
				this.store.dispatch(new DcndIndexViewRequested({ body: DCND }));
			} else {
				this.store.dispatch(new DcndOnServerUpdated({ dcnd: DCND }));
			}
		}

		if (!this.isEditCall) {
			if (this.action === 'create') {
				this.createDcndSubcription();
			} else {
				this.updateDcndSubcription();
			}
			const requestErr = this.store.pipe(select(selectDcndRequestedError)).subscribe((res) => {
				if (res) {
					this.viewLoading = false;
					this.isSubmitDisabled = false;
					if (res.error.returnMes) {
						this.layoutUtilsService.showCustomNotification(res.error.returnMes);
						return;
					}
					this.layoutUtilsService.showCustomNotification(res.error);

				}
			});
			this.subscription.add(requestErr);
			this.isEditCall = true;
		}
	}

	createPayload(avatarLink: string) {
		let dcndPayload = Object.assign({}, this.dcndForm.value);
		if (this.statusCode !== 'A') {
			dcndPayload = Object.assign({}, this.dcndForm.getRawValue());
			if (avatarLink) {
				dcndPayload.avatar = avatarLink;
			} else {
				dcndPayload.avatar = this.imgURL;
			}
			dcndPayload.provinceId = this.dcndForm.value.province[0].provinceId;
			dcndPayload.districtId = this.dcndForm.value.district[0].districtId;
			dcndPayload.wardId = this.dcndForm.value.ward[0].wardId;
			dcndPayload.receiverGender = this.dcndForm.value.receiverGender ? this.dcndForm.value.receiverGender[0].id : undefined;
			if (dcndPayload.guarderListPicture) {
				const guard = [];
				dcndPayload.guarderListPicture.forEach((x) => {
					guard.push(x.pathFileServer);
				});
				dcndPayload.guarderListPicture = guard;
			}
			if (dcndPayload.humanityUpload) {
				const humanity = [];
				dcndPayload.humanityUpload.forEach((x) => {
					humanity.push(x.pathFileServer);
				});
				dcndPayload.humanityUpload = humanity;
			}
		}
		dcndPayload.humanityId = this.humanityId;
		dcndPayload.indexView = dcndPayload.indexView ? dcndPayload.indexView : false;
		delete dcndPayload.province;
		delete dcndPayload.district;
		delete dcndPayload.ward;
		delete dcndPayload.bankName;
		return dcndPayload;
	}

	public onChange({ editor }: ChangeEvent) {
		const data = editor.getData();
		this.dcndForm.value.content = data;
	}

	uploadFile(event) {
		const files = event.target.files;
		if (files.length === 0) {
			return;
		}
		if (files[0].size <= 5000000) {
			const mimeType = files[0].type;
			if (mimeType.match(/image\/*/) == null) {
				return;
			}
			this.dcndForm.patchValue({
				avatar: 'OK',
			});
			this.renderPicture(files[0]);
			return;
		}
		this.layoutUtilsService.showCustomNotification(this.translateService.instant('MESSAGE.IMG_TOO_BIG'), MessageType.Error);
		this.avatarUploader.nativeElement.value = null;
	}

	renderPicture(files) {
		const reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files);
		reader.onload = (event$) => {
			this.imgURL = reader.result;
			this.changeDetectorRef.detectChanges();
		};
		this.avatarUploader.nativeElement.value = null;
	}

	guarderUpload(event) {
		const imagePreview = this.layoutUtilsService.imagePreviewDialog(
			this.action,
			'image/*',
			DocumentType.HUMANITY_REFER,
			this.humanityId,
			this.guarderList,
			this.isGalleryDisable
		);

		imagePreview.afterClosed().subscribe((res: HumanityFile[]) => {
			if (res) {
				this.guarderList = res;
				this.dcndForm.controls['guarderListPicture'].setValue(res);
			}
		});
	}

	dcndUpload(event) {
		const imagePreview = this.layoutUtilsService.imagePreviewDialog(
			this.action,
			'.pdf,image/*',
			DocumentType.HUMANITY_DOCUMENT,
			this.humanityId,
			this.humanityList,
			this.isGalleryDisable
		);

		imagePreview.afterClosed().subscribe((res: HumanityFile[]) => {
			if (res) {
				this.humanityList = res;
				this.dcndForm.controls['humanityUpload'].setValue(res);
			}
		});
	}

	verifyDialog(type: string) {
		const title = this.translateService.instant('MESSAGE.ACTION_CONFIRM', {
			action: `${this.translateService.instant(`ACTION.${type}`)}`,
			name: `${this.translateService.instant('DCNDS.DCND')}`.toLowerCase(),
		});

		const description = this.translateService.instant('MESSAGE.NOTICE_CONFIRM', {
			action: `${this.translateService.instant(`ACTION.${type}`)}`.toLowerCase(),
			name: `${this.translateService.instant('DCNDS.DCND')}`.toLowerCase(),
		});

		const buttonLeft = this.translateService.instant('BUTTON.CANCEL');
		const buttonRight = this.translateService.instant(`ACTION.${type}`);
		return this.layoutUtilsService.customInputElement(title, description, buttonLeft, buttonRight);
	}
	onVerify(type: string, statusCode: string) {
		this.verifyType = type;
		this.verifyStatusCode = statusCode;
		this.clearBankValidation();
		if (statusCode === 'A') {
			this.setBankValidation();
		}
		this.onSubmit();
	}

	setValidation(type: string, validator: ValidatorFn | ValidatorFn[]) {
		const controls = this.dcndForm.controls[type];
		const val = controls.value;
		controls.setValidators(validator);
		controls.setValue(val);
	}

	setBankValidation() {
		this.bankValidator = true;
		this.setValidation('brandName', Validators.required);
		this.setValidation('narrative', Validators.required);
		this.setValidation('accountHolder', [Validators.required, Validators.pattern(this.regexFullname)]);
		this.setValidation('accountNumber',
			[Validators.required, Validators.pattern('^[0-9]*'), Validators.maxLength(13), Validators.minLength(13)]
		);
		// this.dcndForm.markAllAsTouched();

		// setTimeout(() => {
		// 	this.callFocus();
		// 	if (this.dcndForm.valid) {
		// 		this.dcndVerify(this.verifyType, this.verifyStatusCode);
		// 		this.verifyType = null;
		// 		this.verifyStatusCode = null;
		// 	}
		// }, 88);
	}

	clearBankValidation() {
		this.bankValidator = false;
		this.setValidation('brandName', []);
		this.setValidation('narrative', []);
		this.setValidation('accountHolder', [Validators.pattern(this.regexFullname)]);
		this.setValidation('accountNumber', [Validators.pattern('^[0-9]*'), Validators.maxLength(13), Validators.minLength(13)]);
	}

	dcndVerify(type: string, statusCode: string) {
		const dialogRef = this.verifyDialog(type);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				this.verifyStatusCode = null;
				this.verifyType = null;
				return;
			}
			const updateDcnd = new DcndUpdate();
			updateDcnd.humanityId = this.humanityId;
			updateDcnd.statusCode = statusCode;
			if (res.content) {
				updateDcnd.reason = res.content;
			} else {
				updateDcnd.reason = '';
			}
			this.store.dispatch(new DcndUpdated({ id: updateDcnd }));
			if (!this.isVerifyCall) {
				this.verifySubcription();
				this.isVerifyCall = true;
			}

			// tslint:disable: no-shadowed-variable
		});
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to validators name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		let control;
		if (controlName) {
			control = this.dcndForm.controls[controlName];
		} else {
			control = this.dcndForm;
		}
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}


	createForm(dcnd: DcndEdit) {
		let selectGender = null;
		let provinceData = null;
		if (dcnd.provinceId && dcnd.provinceName) {
			provinceData = { provinceId: dcnd.provinceId, provinceName: dcnd.provinceName };
			this.getAddressList(AddressEnum.District, provinceData.provinceId);
		}
		if (dcnd.districtId && dcnd.districtName) {
			this.districtData = { districtId: dcnd.districtId, districtName: dcnd.districtName };
			this.districtSettings.disabled = false;
			this.getAddressList(AddressEnum.District, this.districtData.districtId);
		}
		if (dcnd.wardId && dcnd.wardName) {
			this.wardData = { wardId: dcnd.wardId, wardName: dcnd.wardName };
			this.wardSettings.disabled = false;
		}
		this.imgURL = dcnd.avatar;

		if (this.statusCode === 'A' || this.statusCode === 'R') {
			this.provinceSettings.disabled = true;
			this.districtSettings.disabled = true;
			this.wardSettings.disabled = true;
			this.genderSettings.disabled = true;
			// this.bankNameSettings.disabled = true;
		}
		if (dcnd.guarderListPicture) {
			this.guarderList = dcnd.guarderListPicture;
			this.guarderListSave = dcnd.guarderListPicture;
		}
		if (dcnd.humanityUpload) {
			this.humanityList = dcnd.humanityUpload;
			this.humanityListSave = dcnd.humanityUpload;
		}
		if (dcnd.receiverGender) {
			selectGender = [{
				id: dcnd.receiverGender,
				value: this.translateService.instant(GenderEnum[dcnd.receiverGender]),
			}];
		}

		this.dcndForm = this.dncd.group({
			// group Donee
			receiverName: new FormControl(
				{ value: dcnd.receiverName, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(30),
					Validators.pattern(this.regexFullname),
				]),
			),
			receiverGender: new FormControl(
				{ value: selectGender ? selectGender : [], disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([
					Validators.required
				]),
			),
			dob: new FormControl(
				{ value: new Date(dcnd.dob), disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([
					Validators.required
				]),
			),
			province: new FormControl(
				{ value: provinceData ? [provinceData] : null, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.required]),
			),
			district: new FormControl(
				{
					value: this.districtData ? [this.districtData] : null,
					disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false
				},
				Validators.compose([Validators.required]),
			),
			ward: new FormControl(
				{ value: this.wardData ? [this.wardData] : null, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.required]),
			),
			addressLine: new FormControl(
				{ value: dcnd.addressLine, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
			),
			receiverPhone: new FormControl(
				{ value: dcnd.receiverPhone, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*')]),
			),
			avatar: new FormControl(
				{ value: dcnd.avatar, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.required]),
			),

			// Group Guarder
			guarderName: new FormControl(
				{ value: dcnd.guarderName, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern(this.regexFullname)]),
			),
			guarderPhone: new FormControl(
				{ value: dcnd.guarderPhone, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*')]),
			),
			guarderAddress: new FormControl(
				{ value: dcnd.guarderAddress, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([Validators.minLength(5), Validators.maxLength(200)]),
			),
			guarderListPicture: new FormControl({
				value: dcnd.guarderListPicture,
				disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false
			}),

			// Group Story
			indexView: new FormControl({ value: dcnd.indexView, disabled: this.statusCode === 'R' ? true : false }, Validators.compose([])),
			code: new FormControl(
				{ value: dcnd.code, disabled: true },
				Validators.compose([]),
			),
			title: new FormControl(
				{ value: dcnd.title, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([
					Validators.required,
					Validators.maxLength(99),
					Validators.minLength(30),
					this.isLinkInclude(/(?:([a-z0-9]{2,}(\.[a-z0-9]{1,4}){1,2}))/),
				]),
			),
			summary: new FormControl(
				{ value: dcnd.summary, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([
					Validators.required,
					Validators.maxLength(300),
					Validators.minLength(50),
					this.isLinkInclude(/([a-z0-9]{2,}(\.[a-z0-9]{1,4}){1,2})/),
				]),
			),
			content: new FormControl(
				{ value: dcnd.content, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([
					Validators.required,
					Validators.minLength(100)
				]),
			),
			humanityUpload: new FormControl(
				{ value: dcnd.humanityUpload, disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				Validators.compose([])),

			contentMobile: new FormControl(
				{ value: dcnd.contentMobile, disabled: true },
				Validators.compose([]),
			),

			// Account
			bankName: new FormControl(
				{ value: [], disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
			),
			brandName: new FormControl(
				{ value: dcnd.brandName ? dcnd.brandName : '', disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
			),
			accountNumber: new FormControl(
				{ value: dcnd.accountNumber ? dcnd.accountNumber : '', disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false },
				{
					validators:
						Validators.compose([
							Validators.pattern('^[0-9]*'), Validators.maxLength(13), Validators.minLength(13)
						])
				}
			),
			narrative: new FormControl(
				{ value: dcnd.narrative ? dcnd.narrative : '', disabled: true },
			),
			accountHolder: new FormControl(
				{
					value: dcnd.accountHolder ? dcnd.accountHolder : '',
					disabled: this.statusCode === 'A' || this.statusCode === 'R' ? true : false
				},
				{
					validators:
						Validators.compose([
							// Validators.required,
							Validators.pattern(this.regexFullname),
						])
				}
			),
			lat: new FormControl(dcnd.lat),
			long: new FormControl(dcnd.long)
		}, { validators: this.isDateValid });
	}


}
