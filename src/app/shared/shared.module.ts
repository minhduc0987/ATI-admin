import { NgModule } from '@angular/core';
import { TrimOnBlurDirective } from './directive/trim-whitespaces.directive';

@NgModule({
	declarations: [
		TrimOnBlurDirective
	],
	imports: [
	],
	exports: [
		TrimOnBlurDirective
	],
	entryComponents: [
	]
})

export class SharedModule {
}

