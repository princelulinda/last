import { Directive, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeScript } from '@angular/platform-browser';

@Directive({
  selector: '[appCheckAccess]',
  standalone: true,
})
export class CheckAccessDirective {
  // access: any[] = [];

  constructor(private sanitizer: DomSanitizer) {
    // console.log('ON Init');
  }

  // ngOnInit() {}

  // @Input() set appCheckAccess(condition: string) {
  //   const safeCondition = this.sanitizer.bypassSecurityTrustScript(condition);

  // console.log(condition);
  // if (this.parseCondition(safeCondition)) {
  //   alert("yes it's work");
  // } else {
  //   alert("Don't work");
  // }
  // }

  parseCondition(condition: SafeScript) {
    const sanitizedScript = this.sanitizer.sanitize(
      SecurityContext.SCRIPT,
      condition
    );
    if (sanitizedScript) {
      return eval?.(`"use strict";(${sanitizedScript})`);
    }
  }
}
