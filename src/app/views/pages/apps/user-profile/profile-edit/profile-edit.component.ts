// Angular
import {
	Component,
	OnInit,
	ViewEncapsulation,
	AfterViewInit,
	OnDestroy,
	ChangeDetectorRef,
	ElementRef,
	ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

// Store
import { select, Store } from '@ngrx/store';
import { Subscription, Observable, Subject } from 'rxjs';
import { AppState } from '../../../../../core/reducers';
import {
	// Actions
	UserProfileUpdateOnServer,
	ProvinceRequested,
	DistrictRequested,
	WardRequested,
	ResetUpdateProfileResult,
	UserProfileRequested,
	FileUploadRequested,
	FileRequestedByURL,
	// Selectors
	currentProvince,
	currentDistrict,
	currentWard,
	isUserUpdated,
	isUserProfileError,
	isUserProfileLoaded,
	currentUserProfile,
	isFileUploaded,
	currentfile,
	currentfileData,
	// Models
	Province,
	District,
	Ward,
	UserProfile,
	ReferenceLink,
	ErrorResponse,
	FileUpload,
	fileUploadError,
	selectAddressError,
} from '../../../../../core/apps';
// Material
import { DateAdapter } from '@angular/material/core';
import { REFERENCE_TYPE } from '../../../../../shared/constants/constants';
// Enum
import { GenderEnum, IdentityTypeEnum, AddressEnum, ReferenceTypeEnum, MessageType } from '../../../../../shared';
import { TranslateService } from '@ngx-translate/core';
// Layout 19910000217109
import { LayoutUtilsService } from '../../../../../core/_base/crud';
import { environment } from '../../../../../../environments/environment';

@Component({
	selector: 'kt-profile-edit',
	templateUrl: './profile-edit.component.html',
	styleUrls: ['./profile-edit.component.scss'],

	encapsulation: ViewEncapsulation.None,
})
export class ProfileEditComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('uploader', { static: false }) uploader: ElementRef;
	userProfileForm: FormGroup;
	profile: string;
	companyInfo: string;
	referenceLink: string;
	isIdentityReadOnly = true;
	isReferenceReadOnly = true;
	isUploadImg = false;

	USER: Observable<UserProfile>;
	userName = null;
	lastLogin = null;
	roles = [];

	selectDistrict;
	selectWard;

	isDisable = false;

	isUserUpdateCall = false;
	isFileUploadCall = false;
	isUserSubCall = false;

	hasRole;

	imageFile;
	imgURL: any;
	imgSave: any;
	maxDate: Date;
	file: FileUpload;
	customIdenType = 'text';
	customIdenMaxLength = 12;
	regExFullname =
		'^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽếềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$';

	singleSelectDropdownSettings = {
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'id',
		labelKey: 'value',
		noDataLabel: this.translateService.instant('DROPDOWN.NODATA'),
		text: this.translateService.instant('DROPDOWN.DEFAULT'),
	};

	disabledDropdown = {};

	filterSelectDropdownSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'provinceId',
		labelKey: 'provinceName',
		position: 'bottom',
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translateService.instant('BUTTON.SEARCH'),
		noDataLabel: this.translateService.instant('TABLE.NODATA'),
		text: this.translateService.instant('DROPDOWN.DEFAULT'),
	};

	districtFilterSelectDropdownSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'districtId',
		labelKey: 'districtName',
		position: 'bottom',
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translateService.instant('BUTTON.SEARCH'),
		noDataLabel: this.translateService.instant('TABLE.NODATA'),
		text: this.translateService.instant('DROPDOWN.DEFAULT'),
	};
	wardFilterSelectDropdownSettings = {
		disabled: false,
		singleSelection: true,
		enableCheckAll: false,
		showCheckbox: false,
		primaryKey: 'wardId',
		labelKey: 'wardName',
		position: 'bottom',
		enableSearchFilter: true,
		enableFilterSelectAll: false,
		searchPlaceholderText: this.translateService.instant('BUTTON.SEARCH'),
		noDataLabel: this.translateService.instant('TABLE.NODATA'),
		text: this.translateService.instant('DROPDOWN.DEFAULT'),
	};

	genderList = [];
	identityTypeList = [];
	provinceList = [];
	districtList = [];
	wardList = [];
	referenceTypeList = [];
	changeSubList = [];

	// private componetDestroyed: Subject = new Subject();

	// private subscriptions: Subscription[] = [];
	private subscriptions: Subscription = new Subscription();
	// private ngUnsubscribe: Subject = new Subject();
	// todos: Subscription;
	// posts: Subscription;
	/** Component constructor
	 *
	 * @param userProfile: FormBuilder
	 * @param store: Store<AppState>
	 * @param translateService: TranslateService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param dateAdapter: DateAdapter<any>
	 */

	constructor(
		private userProfile: FormBuilder,
		private store: Store<AppState>,
		private translateService: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private dateAdapter: DateAdapter<any>,
		private changeDetectorRef: ChangeDetectorRef,
		private el: ElementRef,
	) {
		// fill dropdown
	}

	ngOnInit() {
		this.districtFilterSelectDropdownSettings.disabled = true;
		this.wardFilterSelectDropdownSettings.disabled = true;

		this.initUserProfileForm();
		this.userReload();
		this.profile = this.translateService.instant('GENERAL.MY_PROFILE');
		this.companyInfo = this.translateService.instant('USER.INFO.COMPANY.INFO');
		this.referenceLink = this.translateService.instant('USER.INFO.REFERENCE_LINK.NAME');

		this.referenceTypeList = REFERENCE_TYPE;
		this.genderList = this.generateListByEnum(GenderEnum);
		this.identityTypeList = this.generateListByEnum(IdentityTypeEnum);
		this.getAddressList(AddressEnum.Province);

		// set Current Language for DateTimePicker
		this.dateAdapter.setLocale(this.translateService.currentLang);
		this.maxDate = new Date();
		// this.onUpdateProfile();
		this.messageSubcription();
	}

	ngAfterViewInit() {
		// const changeStatusSubcribe = this.userProfileForm.dirty
		// this.subscriptions.push(changeStatusSubcribe);
	}

	messageSubcription() {
		const changeSub = this.store.pipe(select(isUserProfileError)).subscribe((res) => {
			if (res) {
				// UNHANDLE_FAILED
				// let errorMes = 'Lỗi không xác định, xin thử lại!';
				let errorMes = this.translateService.instant('MESSAGE.SYSTEM_ERROR');
				if (res.error && res.error.returnMes) {
					errorMes = res.error.returnMes;
				}
				if (res.error && res.error.message) {
					errorMes = res.error.message;
				}
				this.layoutUtilsService.showCustomNotification(errorMes, MessageType.Error);
				this.isDisable = false;
			}
		});
		this.subscriptions.add(changeSub);

		const provinceSub = this.store.pipe(select(currentProvince)).subscribe((result) => {
			if (result) {
				this.provinceList = result;
			}
			// if (value) {
			// 	this.userProfileForm.patchValue({
			// 		province: [value],
			// 	});
			// }
		});
		this.subscriptions.add(provinceSub);

		const districtSub = this.store.pipe(select(currentDistrict)).subscribe((result) => {
			if (result) {
				this.districtList = result;
				if (this.selectDistrict) {
					this.userProfileForm.patchValue({
						district: [this.selectDistrict],
					});
					this.changeDetectorRef.detectChanges();
				}
			}
		});
		this.subscriptions.add(districtSub);

		const wardSub = this.store.pipe(select(currentWard)).subscribe((result) => {
			if (result) {
				this.wardList = result;
				if (this.selectWard) {
					this.userProfileForm.patchValue({
						ward: [this.selectWard],
					});

					this.changeDetectorRef.detectChanges();
				}
			}
		});
		this.subscriptions.add(wardSub);
		this.subscriptions.add(
			this.store.pipe(select(selectAddressError)).subscribe((error) => {
				if (error) {
					this.layoutUtilsService.showCustomNotification(this.translateService.instant('MESSAGE.ADDRESS_ERROR'));
				}
			}),
		);
	}

	userReload() {
		this.store.dispatch(new UserProfileRequested());
		this.USER = this.store.pipe(select(currentUserProfile));

		if (!this.isUserSubCall) {
			const userSub = this.store.pipe(select(currentUserProfile)).subscribe((res) => {
				if (res) {
					this.userProfilePatchValue(res);
				}
			});
			this.subscriptions.add(userSub);
			this.isUserSubCall = true;
		} // this.subscriptions.add(userSub);
	}

	ngOnDestroy() {
		// this.subscriptions.forEach(el => el.unsubscribe());
		this.subscriptions.unsubscribe();
		this.store.dispatch(new ResetUpdateProfileResult());
	}

	initUserProfileForm() {
		this.userProfileForm = this.userProfile.group(
			{
				userId: [''],
				email: [
					'',
					Validators.compose([
						Validators.required,
						Validators.pattern('.+@.+\\..+'),
						Validators.minLength(3),
						Validators.maxLength(100),
					]),
				],
				fullname: [
					'',
					Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern(this.regExFullname)]),
				],
				gender: ['', Validators.required],
				phone: [
					'',
					Validators.compose([
						Validators.pattern('[0-9]*'),
						Validators.maxLength(10),
						Validators.minLength(10),
						// Validators.max(9999999999),
						// Validators.min(1000000000)
					]),
				],
				dob: ['', Validators.required],
				idenType: [''],
				identityType: [''],
				identityNumber: [''],
				ward: [''],
				province: [''],
				district: [''],
				addressLine: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(200)])],
				about: [''],
				company: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(100)])],
				position: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
				representative: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
				userType: [''],
				pic: [''],
				status: [''],
				zipCode: [''],
				referenceType: [''],
				referenceLink: [''],
			},
			{ validators: Validators.compose([this.isDateValid, this.identityTypeValidation]) },
		);
	}

	identityTypeValidation(
		group: AbstractControl,
	): {
		isIdentityValid: boolean;
		isCCCDValid: boolean;
		isCMNDValid: boolean;
		isHCValid: boolean;
		// isIdentityNumRequired: boolean
	} {
		const type = group.get('idenType').value;
		const value = group.get('identityNumber').value;

		if (!value || !type) {
			return;
		}
		if (type[0].id === 'CCCD') {
			const regex = /^[0-9]{12}$/;
			const sd = '';
			if (regex.test(value)) {
				return;
			}
			return {
				isIdentityValid: true,
				isCCCDValid: true,
				isCMNDValid: false,
				isHCValid: false,
				// isIdentityNumRequired: false
			};
		}
		if (type[0].id === 'CMND') {
			const regex = /^[0-9]{9}$/;
			if (regex.test(value)) {
				return;
			}
			return {
				isIdentityValid: true,
				isCCCDValid: false,
				isCMNDValid: true,
				isHCValid: false,
				// isIdentityNumRequired: false
			};
		}
		if (type[0].id === 'HC') {
			const regex = /^.{8}$/;
			if (regex.test(value)) {
				return;
			}
			return {
				isIdentityValid: true,
				isCCCDValid: false,
				isCMNDValid: false,
				isHCValid: true,
				// isIdentityNumRequired: false
			};
		}
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
		if (value === 'Reference') {
			Object.values(value).map((item: string) => {
				outputList.push({
					type: item,
					link: this.userProfileForm.controls[item].value,
				});
			});
			return outputList;
		}
		const properties = Object.getOwnPropertyNames(value);
		properties.map((item) => {
			outputList.push({
				id: item,
				value: this.translateService.instant(value[item]),
			});
		});
		return outputList;
	}

	getAddressList(type: AddressEnum, input?: any) {
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

	// onUpdateProfile() {
	// 	const updateSuccessSubcribe = this.store.pipe(select(isUserUpdated)).subscribe(
	// 		result => {
	// 			if (result) {
	// 				// this.store.dispatch(new UserProfileRequested());
	// 				this.layoutUtilsService.showActionNotification(
	// 					'Cập nhật thông tin thành công',
	// 					MessageType.Update
	// 				);
	// 			}
	// 		}
	// 	);
	// 	this.subscriptions.push(updateSuccessSubcribe);
	// 	const updateFailedSubcribe = this.store.pipe(select(isUserProfileError)).subscribe(
	// 		res => {
	// 			let errorMess = '';
	// 			Object.getOwnPropertyNames(res.error).map(err => { errorMess += res.error[err] + ' '; });
	// 			this.layoutUtilsService.showActionNotification(
	// 				errorMess,
	// 				MessageType.Update
	// 			);
	// 		}
	// 	);
	// 	this.subscriptions.push(updateFailedSubcribe);
	// }

	onSubmit() {
		this.isDisable = true;

		const controls = this.userProfileForm.controls;
		// if (this.userProfileForm.value.idenType && !this.userProfileForm.value.identityNumber) {
		// 	this.userProfileForm.setErrors({ isIdentityNumRequired: true });
		// }
		if (this.userProfileForm.invalid) {
			this.isDisable = false;
			Object.keys(controls).forEach((controlName) => {
				controls[controlName].markAsTouched();
			});
			const invalidControl = this.el.nativeElement.querySelector('.is-invalid');
			if (invalidControl) {
				invalidControl.focus();
			}
			return;
		}
		if (this.imageFile) {
			// const img = this.imgURL;
			const formData = new FormData();
			formData.append('type', 'profile');
			formData.append('file', this.imageFile);
			// this.store.dispatch(new FileUploadRequested({ type: 'profile', body: formData }));
			this.store.dispatch(new FileUploadRequested({ body: formData }));

			if (!this.isFileUploadCall) {
				const fileUploadSub = this.store.pipe(select(isFileUploaded)).subscribe((res) => {
					if (res) {
						this.updateProfile();
						this.imageFile = null;
					}
				});
				const changeSub = this.store.pipe(select(fileUploadError)).subscribe((err) => {
					if (err) {
						let errorMes = this.translateService.instant('MESSAGE.SYSTEM_ERROR');
						if (err.error && err.error.returnMes) {
							errorMes = err.error.returnMes;
						}
						if (err.error && err.error.message) {
							errorMes = err.error.message;
						}
						this.layoutUtilsService.showCustomNotification(errorMes, MessageType.Error);
						this.imageFile = null;
						this.imgURL = this.imgSave;
						this.isDisable = false;
						this.changeDetectorRef.detectChanges();
					}
				});
				this.subscriptions.add(changeSub);
				this.subscriptions.add(fileUploadSub);
				this.isFileUploadCall = true;
				this.changeDetectorRef.detectChanges();
			}
		} else {
			this.updateProfile();
		}
	}

	updateProfile() {
		const USER_PROFILE = this.createPayload();
		this.store.dispatch(new UserProfileUpdateOnServer({ userProfile: USER_PROFILE }));
		if (!this.isUserUpdateCall) {
			const update = this.store.pipe(select(isUserUpdated)).subscribe((res) => {
				if (res) {
					this.userReload();
					this.layoutUtilsService.showCustomNotification(
						this.translateService.instant('MESSAGE.PROFILE_UPDATE_SUCCESS'),
						MessageType.Update,
					);
					this.isDisable = false;
				}
			});
			this.subscriptions.add(update);
			this.isUserUpdateCall = true;
		}
		// this.changeDetectorRef.detectChanges();
		// const userUpdatedSub = this.store.pipe(select(isUserUpdated)).subscribe((result) => {
		// 	if (result) {
		// 		console.log(519);
		// 	}
		// });
		// this.subscriptions.add(userUpdatedSub);
	}

	/**
	 * Ham hoan tac chua su dung
	 *
	 */
	// onReset() {
	// 	if (!this.isContentHasChanged) {
	// 		const dialogRef = this.layoutUtilsService.customeElement(
	// 			// this.translateService.instant('VALIDATION.PROFILE_UPDATE_SUCCESS'),
	// 			this.translateService.instant('MESSAGE.NOTIFICATION_MESSAGE'),
	// 			this.translateService.instant('MESSAGE.PROFILE_RESET_WARNING'),
	// 			this.translateService.instant('MESSAGE.PROFILE_RESET_WAITING'),
	// 			this.translateService.instant('BUTTON.CANCEL'),
	// 			this.translateService.instant('BUTTON.RESET'),
	// 		);
	// 		dialogRef.beforeClosed().subscribe((res) => {
	// 			if (!res) {
	// 				return;
	// 			}
	// 			this.userReload();
	// 			if (dialogRef) {
	// 				dialogRef.close();
	// 			}
	// 			// this.USER.subscribe(result => {
	// 			// 	if (result) {
	// 			// 		this.userProfilePatchValue(result);
	// 			// 		this.userProfileForm.markAsPristine();

	// 			// 	}
	// 			// });
	// 		});
	// 	} else {
	// 		this.USER.subscribe((result) => {
	// 			if (result) {
	// 				this.userProfilePatchValue(result);
	// 			}
	// 		});
	// 	}
	// }

	uploadFile(event) {
		const files = event.target.files;
		if (files.length === 0) {
			return;
		}

		// console.log(files[0]);
		if (files[0].size <= 5000000) {
			const mimeType = files[0].type;
			if (mimeType.match(/image\/*/) == null) {
				return;
			}

			this.renderPicture(files[0]);
			return;
		}
		this.layoutUtilsService.showCustomNotification(this.translateService.instant('MESSAGE.IMG_TOO_BIG'), MessageType.Error);
		// this.uploader.nativeElement.value = null;
	}

	renderPicture(files) {
		const reader = new FileReader();
		this.imageFile = files;
		reader.readAsDataURL(files);
		reader.onload = (event$) => {
			this.imgURL = reader.result;
			this.imgSave = reader.result;
			this.changeDetectorRef.detectChanges();
		};
		// this.uploader.nativeElement.value = null;
	}

	// Dropdown Item Select
	onItemSelect(inputValue: any, type?: string) {
		if (type === 'idenType') {
			if (inputValue.id === 'CCCD') {
				// this.customIdenType = 'number';
				this.customIdenMaxLength = 12;
			}
			if (inputValue.id === 'CMND') {
				// this.customIdenType = 'number';
				this.customIdenMaxLength = 9;
			}
			if (inputValue.id === 'HC') {
				this.customIdenType = 'text';
				this.customIdenMaxLength = 8;
			}
			this.isIdentityReadOnly = false;
			this.userProfileForm.controls.identityNumber.reset();
			// this.userProfileForm.patchValue({
			// 	identityNumber: null,
			// });
			this.userProfileForm.value.identityType = inputValue.id;
		}
		if (this.userProfileForm.value.referenceType) {
			this.isReferenceReadOnly = false;
			this.userProfileForm.patchValue({
				referenceLink: null,
			});
		}
		if (type === AddressEnum.Province) {
			this.selectDistrict = null;
			const selectProvince = inputValue as Province;
			const settings = Object.assign({}, this.districtFilterSelectDropdownSettings);
			settings.disabled = false;
			this.districtFilterSelectDropdownSettings = settings;
			this.getAddressList(AddressEnum.District, selectProvince.provinceId);
			this.onDeSelectAll(AddressEnum.District);
		}

		if (type === AddressEnum.District) {
			this.selectWard = null;
			const selectDistrict = inputValue as District;
			const settings = Object.assign({}, this.wardFilterSelectDropdownSettings);
			settings.disabled = false;
			this.wardFilterSelectDropdownSettings = settings;
			this.getAddressList(AddressEnum.Ward, selectDistrict.districtId);
			this.onDeSelectAll(AddressEnum.Ward);
		}

		if (type === AddressEnum.Ward) {
		}
	}

	// Dropdown Clear All
	onDeSelectAll(type: string) {
		this.userProfileForm.controls[type].setValue('');
		if (type === AddressEnum.Province) {
			this.onDeSelectAll(AddressEnum.District);
			const settings = Object.assign({}, this.districtFilterSelectDropdownSettings);
			settings.disabled = true;
			this.districtFilterSelectDropdownSettings = settings;
		}
		if (type === AddressEnum.District) {
			this.onDeSelectAll(AddressEnum.Ward);
			const settings = Object.assign({}, this.wardFilterSelectDropdownSettings);
			settings.disabled = true;
			this.wardFilterSelectDropdownSettings = settings;
		}
		if (type === 'idenType') {
			this.isIdentityReadOnly = true;
			this.userProfileForm.patchValue({
				identityType: null,
				identityNumber: null,
			});
		}
		if (type === 'referenceType') {
			this.userProfileForm.patchValue({
				referenceType: null,
				referenceLink: null,
			});
		}
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
			control = this.userProfileForm.controls[controlName];
		} else {
			control = this.userProfileForm;
		}
		if (!control) {
			return false;
		}
		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	createPayload(): UserProfile {
		const userProfile = Object.assign({}, this.userProfileForm.value as UserProfile);
		userProfile.gender = this.userProfileForm.value.gender ? this.userProfileForm.value.gender[0].id : '';
		userProfile.wardId = this.userProfileForm.value.ward ? this.userProfileForm.value.ward[0].wardId : '';
		userProfile.identityType = this.userProfileForm.value.idenType ? this.userProfileForm.value.idenType[0].id : '';

		if (this.file) {
			userProfile.pic = this.file.link;
		}

		// if (this.userProfileForm.value.dob) {
		// 	const dob = new Date(this.userProfileForm.value.dob);
		// 	const change = new Date(dob.toDateString());
		// 	userProfile.dob = change.toLocaleDateString();
		// 	console.log(dob);
		// 	console.log(change);
		// }
		// if (!userProfile.identityNumber) {
		// 	userProfile.identityType = null;
		// }

		if (this.userProfileForm.value.referenceLink) {
			userProfile.referenceLinks = [];
			const ref = new ReferenceLink();
			ref.link = this.userProfileForm.value.referenceLink;
			// ref.type = this.userProfileForm.value.referenceType[0].value;
			ref.type = 'Website';
			userProfile.referenceLinks.push(ref);
		}

		return userProfile;
	}

	userProfilePatchValue(userProfile: UserProfile) {
		this.userProfileForm.patchValue(userProfile);
		if (!this.userName) {
			this.userName = userProfile.username;
		}
		if (!this.lastLogin) {
			this.lastLogin = userProfile.lastLogin;
		}
		if (userProfile.pic) {
			// const token = localStorage.getItem(environment.authTokenKey);
			// this.imgURL = `${userProfile.pic}/${token}`;
			this.imgURL = userProfile.pic;
		}

		if (userProfile.roles && userProfile.roles.length > 0) {
			// let roleTemp = '';
			// userProfile.roles.map(item => {
			// 	roleTemp += `${item.roleName},`;
			// });
			// this.roles = roleTemp.substring(0, roleTemp.length - 1);
			this.roles = userProfile.roles;
		}
		if (userProfile.gender) {
			const selectGender = {
				id: userProfile.gender,
				value: this.translateService.instant(GenderEnum[userProfile.gender]),
			};
			this.userProfileForm.patchValue({
				gender: [selectGender],
			});
		}

		if (userProfile.dob) {
			const dateOfBirth = new Date(userProfile.dob);
			this.userProfileForm.patchValue({
				dob: dateOfBirth,
			});
		}

		if (userProfile.identityType) {
			const selectIdentityType = {
				id: userProfile.identityType,
				value: this.translateService.instant(IdentityTypeEnum[userProfile.identityType]),
			};
			this.userProfileForm.patchValue({
				idenType: [selectIdentityType],
			});
			this.isIdentityReadOnly = false;
		} else {
			this.userProfileForm.patchValue({
				idenType: null,
			});
		}

		if (userProfile.provinceId) {
			const selectProvince = {
				provinceId: userProfile.provinceId,
				provinceName: userProfile.provinceName,
			};

			// District
			// const settings = Object.assign({}, this.districtFilterSelectDropdownSettings);
			// settings.disabled = false;
			// this.districtFilterSelectDropdownSettings = settings;
			this.districtFilterSelectDropdownSettings.disabled = false;
			this.userProfileForm.patchValue({
				province: [selectProvince],
			});

			if (userProfile.districtId) {
				this.selectDistrict = {
					districtId: userProfile.districtId,
					districtName: userProfile.districtName,
				};
				this.getAddressList(AddressEnum.District, selectProvince.provinceId);

				// Ward
				// const wardSettings = Object.assign({}, this.wardFilterSelectDropdownSettings);
				// wardSettings.disabled = false;
				// this.wardFilterSelectDropdownSettings = wardSettings;
				this.wardFilterSelectDropdownSettings.disabled = false;
				if (userProfile.wardId) {
					this.selectWard = {
						wardId: userProfile.wardId,
						wardName: userProfile.wardNane,
					};
					this.getAddressList(AddressEnum.Ward, this.selectDistrict.districtId);
				}
			}
		}

		if (userProfile.referenceLinks && userProfile.referenceLinks.length > 0) {
			// userProfile.referenceLinks.forEach(item => {
			// 	this.userProfileForm.patchValue({
			// 		referenceType: [{ value: item.type }],
			// 		referenceLink: item.link
			// 	});
			// 	// this.userProfileForm.controls[item.type].setValue(item.link);
			// });
			this.userProfileForm.patchValue({
				referenceLink: userProfile.referenceLinks[0].link,
			});
		}
		return true;
	}
}
