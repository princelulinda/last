import { Directive, ElementRef, Input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AccessModel } from '../../../components/admin/access/access.models';

@Directive({
  selector: '[appCheckAccess]',
  standalone: true,
})
export class CheckAccessDirective {
  accesses: AccessModel[] | [] = [
    {
      id: 124,
      access_code: 'credits.creditline.authorize_credit_line',
      access_type: 'execute',
      access_type_list: ['execute'],
    },
    {
      id: 122,
      access_code: 'human_resources.operatororganization.invite_operator',
      access_type: 'execute',
      access_type_list: ['execute'],
    },
    {
      id: 120,
      access_code: 'project.project.make_scrum',
      access_type: 'execute',
      access_type_list: ['execute', 'validate', 'authorize'],
    },
  ];

  // conditions: [string, string, '||' | '&&' | ''][] = [
  //   ['credits.creditline.authorize_credit_line', '(execute && see)', '||'],
  //   ['account.modif', '(execute && authorize)', '&&'],
  //   ['account.modif', '(execute)', ''],
  // ];

  constructor(
    private sanitizer: DomSanitizer,
    private el: ElementRef
  ) {}

  @Input({ required: true }) set appCheckAccess(
    condition: [string, string, '||' | '&&' | ''][]
  ) {
    const conditionString = this.buildConditionString(this.accesses, condition);
    const isChecked = this.parseCondition(conditionString);
    if (!isChecked) {
      (this.el.nativeElement as HTMLElement).remove();
    }
  }

  checkAccess(access: AccessModel, condition: string): boolean {
    const { access_type_list } = access;
    const see = access_type_list.includes('see');
    const authorize = access_type_list.includes('authorize');
    const execute = access_type_list.includes('execute');
    const validate = access_type_list.includes('validate');

    const fx = new Function(
      'see',
      'authorize',
      'execute',
      'validate',
      `return ${condition};`
    );
    return fx(see, authorize, execute, validate);
  }

  buildConditionString(
    accesses: AccessModel[],
    conditions: [string, string, '||' | '&&' | ''][]
  ): string {
    return conditions
      .map(([accessCode, condition, operator]) => {
        const access = accesses.find(item => item.access_code === accessCode);
        if (access) {
          return `${this.checkAccess(access, condition)}`.concat(
            ` ${operator} `
          );
        }
        return 'false'.concat(` ${operator} `);
      })
      .join(' ');
  }

  parseCondition(condition: string) {
    const safeCondition = this.sanitizer.bypassSecurityTrustScript(condition);
    const sanitizedScript = this.sanitizer.sanitize(
      SecurityContext.SCRIPT,
      safeCondition
    );
    const geval = eval;
    return geval(`"use strict";(${sanitizedScript})`);
  }
}
