import { Directive, Input, SecurityContext } from '@angular/core';
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

  constructor(private sanitizer: DomSanitizer) {}

  @Input({ required: true }) set appCheckAccess(
    condition: [string, string, '||' | '&&' | ''][]
  ) {
    const conditionString = this.buildConditionString(this.accesses, condition);
    console.log('FINAL CONDITION', conditionString);
    const isChecked = this.parseCondition(conditionString);
    console.log('ACCESSES CONDITIONS CHECKED', isChecked); // Affiche true ou false selon les conditions
  }

  checkAccess(access: AccessModel, condition: string): boolean {
    const { access_type_list } = access;
    // eslint-disable-next-line
    const see = access_type_list.includes('see');
    // eslint-disable-next-line
    const authorize = access_type_list.includes('authorize');
    // eslint-disable-next-line
    const execute = access_type_list.includes('execute');
    // eslint-disable-next-line
    const validate = access_type_list.includes('validate');

    return eval(condition);
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
      .join(' '); // Utilisez '||' si nécessaire
  }

  parseCondition(condition: string) {
    const safeCondition = this.sanitizer.bypassSecurityTrustScript(condition);
    const sanitizedScript = this.sanitizer.sanitize(
      SecurityContext.SCRIPT,
      safeCondition
    );
    return eval?.(`"use strict";(${sanitizedScript})`);
  }
}
