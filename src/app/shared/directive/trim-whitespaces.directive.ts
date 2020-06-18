import { Directive, ElementRef, Self, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Directive({
	selector: '[ktAppTrimOnBlur]'
})
export class TrimOnBlurDirective implements OnInit {

	constructor(
		private elementRef: ElementRef,
		@Self() private ngControl: NgControl) {
	}

	ngOnInit(): void {
		fromEvent(this.elementRef.nativeElement, 'blur').pipe(
		).subscribe(() => {
			const currentValue: string = this.ngControl.value.toString();
			const whitespace = ' ';
			if (currentValue.startsWith(whitespace) || currentValue.endsWith(whitespace)) {
				return this.ngControl.control.patchValue(currentValue.trim());
			}
		});
	}

}
