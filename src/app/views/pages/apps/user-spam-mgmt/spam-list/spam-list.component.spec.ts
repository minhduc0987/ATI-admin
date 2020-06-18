import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpamListComponent } from './spam-list.component';

describe('SpamListComponent', () => {
	let component: SpamListComponent;
	let fixture: ComponentFixture<SpamListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SpamListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpamListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
