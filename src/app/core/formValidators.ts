import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
    static hasCapitalLetter: ValidatorFn = (control: AbstractControl) => {
        const name = "hasCapitalLetter";
        const regex = /[A-Z]/;
        return this.regexValidator(name, regex, control);
    }

    static hasLowercaseLetter: ValidatorFn = (control: AbstractControl) => {
        const name = "hasLowercaseLetter";
        const regex = /[a-z]/;
        return this.regexValidator(name, regex, control);
    }

    static hasNumber: ValidatorFn = (control: AbstractControl) => {
        const name = "hasNumber";
        const regex = /\d/;
        return this.regexValidator(name, regex, control);
    }

    static noSpecialCharacters: ValidatorFn = (control: AbstractControl) => {
        const name = "noSpecialCharacters";
        const regex = /\s/;
        return this.regexValidator(name, regex, control, true);
    }

    private static regexValidator = (name: string, regex: RegExp, control: AbstractControl, inverse: boolean = false): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const matches = !inverse ? regex.test(control.value) : !regex.test(control.value);

        return matches ? null : {
            [name]: {
                value: control.value,
                pattern: regex.source
            }
        };
    }
}
