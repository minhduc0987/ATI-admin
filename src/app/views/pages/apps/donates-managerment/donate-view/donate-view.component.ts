import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { ViewDonate,
	DonateViewLoad,
	selectViewDonateId,
	DonatesStatus,
	DonateApprove,
	selectDonateApproveError,
	selectDonateApproveSuccess,
	DonateReject,
	selectDonateRejectError,
	selectDonateRejectSuccess,
	DonateSpam,
	selectDonateSpamError,
	selectDonateSpamSuccess
} from '../../../../../core/apps/';
import { AppState } from '../../../../../core/reducers';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
	LayoutUtilsService,
} from '../../../../../core/_base/crud';
import { MessageType } from '../../../../../shared';

@Component({
	selector: 'kt-donate-view',
	templateUrl: './donate-view-ck.component.html',
	styleUrls: ['./donate-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})
// tslint:disable: variable-name
export class DonateViewComponent implements OnInit, OnDestroy {
	donateForm: FormGroup;
	viewDonate$: Observable<ViewDonate>;
	fundId: number;
	title;
	content;
	approve;
	reject;
	spam;
	invalid = false;
	// private subscriptions: Subscription[] = [];
	subscription: Subscription = new Subscription();
	constructor(
		private store: Store<AppState>,
		private route: ActivatedRoute,
		private donateFB: FormBuilder,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router
	) {
		const id = this.route.snapshot.paramMap.get('id');
		this.fundId = parseInt(id, 10);
		if (this.fundId) {
			this.store.dispatch(new DonateViewLoad({ id: this.fundId }));
			return;
		}
	 }

	ngOnInit() {
		this.createForm();
		const humanity = this.store.pipe(select(selectViewDonateId)).subscribe((res) => {
			if (res) {
				this.donateForm.patchValue({
					fund_name: res.fund_name,
					fund_phone: res.fund_phone,
					fund_email: res.fund_email,
					fund_price: this.formatNumber(res.fund_price),
					wishes: res.wishes,
					view_humanity: res.viewHumanity,
					fund_actual_price: this.formatNumber(res.fund_actual_price)
				});
				if (res.fund_status !== 'W') {
					this.donateForm.controls['fund_actual_price'].disable();
				}
				if (res.type === 'C') {
					this.title = this.translate.instant('DONATES.CAMPAIGN_NAME');
					this.content = res.campaign_name;
				} else {
					this.title = this.translate.instant('DONATES.DCND_NAME');
					this.content = res.humanity_name;
				}
				switch (res.fund_status) {
					case 'A':
						this.approve = false;
						this.reject = false;
						this.spam = false;
					 break;
					case 'W':
						this.approve = true;
						this.reject = true;
						this.spam = true;
					 break;
					case 'R':
						this.approve = true;
						this.reject = false;
						this.spam = true;
					 break;
					case 'S':
						this.approve = false;
						this.reject = false;
						this.spam = false;
					 break;
					default:
						this.approve = false;
						this.reject = false;
						this.spam = false;
				}
			}
		});
		this.subscription.add(humanity);
	}
	onChangeCurrency() {
		this.donateForm.patchValue({
			fund_actual_price: this.formatNumber(this.donateForm.value.fund_actual_price)
		});
	}
	createForm() {
		this.donateForm = this.donateFB.group({
			fund_name: [{value: '', disabled: true}],
			fund_phone: [{value: '', disabled: true}],
			fund_email: [{value: '', disabled: true}],
			fund_price: [{value: '', disabled: true}],
			wishes: [{value: '', disabled: true}],
			view_humanity: [{value: '', disabled: true}],
			fund_actual_price: [],
		});
	}
	formatNumber(n: any) {
		if (n !== null) {
			return n.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	}
	approveDonate() {
		if (this.donateForm.value.fund_actual_price) {
			const price = parseFloat(this.donateForm.value.fund_actual_price.toString().replace(/\,/g, ''));
			if (price < 50000 || price >= 1000000000000) {
				this.invalid = true;
				return;
			}
		}
		this.invalid = false;
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.APPROVE')}`,
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.APPROVE')}`.toLowerCase(),
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.APPROVE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const appSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const changeStatusDonate = new DonatesStatus();
			changeStatusDonate.fundId = this.fundId;
			if (this.donateForm.value.fund_actual_price) {
				changeStatusDonate.fundActualPrice = parseFloat(this.donateForm.value.fund_actual_price.toString().replace(/\,/g, ''));
			}
			if (res.content) {
				changeStatusDonate.rejectReson = res.content;
			} else {
				changeStatusDonate.rejectReson = '';
			}
			this.store.dispatch(new DonateApprove({ id: changeStatusDonate }));
			// tslint:disable: no-shadowed-variable
			const appFaiSub = this.store.pipe(select(selectDonateApproveError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(appFaiSub);
			const appSucSub = this.store.pipe(select(selectDonateApproveSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigateByUrl('donates-managerment/list');
				}
			});
			this.subscription.add(appSucSub);
		});
		this.subscription.add(appSub);
	}
	rejectDonate() {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.REFUSE')}`,
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.REFUSE')}`.toLowerCase(),
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.REFUSE');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const rejSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const changeStatusDonate = new DonatesStatus();
			changeStatusDonate.fundId = this.fundId;
			if (res.content) {
				changeStatusDonate.rejectReson = res.content;
			} else {
				changeStatusDonate.rejectReson = '';
			}
			this.store.dispatch(new DonateReject({ id: changeStatusDonate }));
			// tslint:disable: no-shadowed-variable
			const rejFaiSub = this.store.pipe(select(selectDonateRejectError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(rejFaiSub);
			const rejSucSub = this.store.pipe(select(selectDonateRejectSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigateByUrl('donates-managerment/list');
				}
			});
			this.subscription.add(rejSucSub);
		});
		this.subscription.add(rejSub);
	}
	spamDonate() {
		const _title = this.translate.instant('MESSAGE.ACTION_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.SPAM')}`,
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _description = this.translate.instant('MESSAGE.NOTICE_CONFIRM',
			{
				action: `${this.translate.instant('ACTION.SPAM')}`.toLowerCase(),
				name: `${this.translate.instant('DONATES.DONATE')}`.toLowerCase()
			});
		const _buttonLeft = this.translate.instant('BUTTON.CANCEL');
		const _buttonRight = this.translate.instant('ACTION.SPAM');
		const dialogRef = this.layoutUtilsService.customInputElement(_title, _description, _buttonLeft, _buttonRight);
		const spamSucSub = dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const changeStatusDonate = new DonatesStatus();
			changeStatusDonate.fundId = this.fundId;
			if (res.content) {
				changeStatusDonate.rejectReson = res.content;
			} else {
				changeStatusDonate.rejectReson = '';
			}
			this.store.dispatch(new DonateSpam({ id: changeStatusDonate }));
			// tslint:disable: no-shadowed-variable
			const spamFaiSub = this.store.pipe(select(selectDonateSpamError)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.ERROR');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				}
			});
			this.subscription.add(spamFaiSub);
			const spamSucSub = this.store.pipe(select(selectDonateSpamSuccess)).subscribe(res => {
				if (res) {
					const _deleteMessage = this.translate.instant('MESSAGE.SUCCESS');
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.router.navigateByUrl('donates-managerment/list');
				}
			});
			this.subscription.add(spamSucSub);
		});
		this.subscription.add(spamSucSub);
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
