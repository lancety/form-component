import {iFormControlConfig, iFormControlConfig__varCust, iFormControlConfig_varAttr} from "./form.type";

export interface iFormDataValidationResult {
    valid: boolean,     // true: message is pass message; false: message is error message
    errorField: string,
    errorMessage: string,    // success or error message
}

export function formDataValidation(formData, formConfig: Array<iFormControlConfig>): iFormDataValidationResult[] {
    let errors: iFormDataValidationResult[] = [];
    formConfig.forEach(fieldConfig => {
        const fieldName = fieldConfig.name;
        fieldConfig.varAttr && errors.push(validateAttrRules(formData, fieldName, fieldConfig.varAttr));
        fieldConfig.varCust && (errors = errors.concat(validateCustRules(formData, fieldName, fieldConfig.varCust)));
    });

    return errors.filter(error => error.valid === false);
}

function validateAttrRules(formdata, fieldName, rules: iFormControlConfig_varAttr): iFormDataValidationResult {
    let errorMessage = "";

    const fieldValue = formdata[fieldName];
    const ruleNames = Object.keys(rules);
    const invalidRuleIndex = ruleNames.findIndex(ruleName => {
        const rule = rules[ruleName];
        switch (ruleName) {
            case "required":
                if ([undefined, null, NaN, ""].indexOf(fieldValue) > -1) {
                    errorMessage = `${fieldName} is required`;
                    return true;
                }
                break;
            case "pattern": {
                let reg: RegExp;
                if (typeof rule === "string") {
                    reg = new RegExp(rule);
                } else if (rule.constructor !== RegExp) {
                    errorMessage = `Validation pattern not in right format`;
                    return true;
                }
                if (fieldValue && !reg.test(fieldValue)) {
                    errorMessage = `${fieldName} format is not correct`;
                    return true;
                }
                break;
            }
            case "min":
                if ([undefined, null, NaN, ""].indexOf(fieldValue) === -1 && fieldValue < rule) {
                    errorMessage = `${fieldName} min value is ${rule}`;
                    return false;
                }
                break;
            case "max":
                if ([undefined, null, NaN, ""].indexOf(fieldValue) === -1 && fieldValue > rule) {
                    errorMessage = `${fieldName} max value is ${rule}`;
                    return true;
                }
                break;
            case "minLength":
                if ([undefined, null, NaN, ""].indexOf(fieldValue) === -1 && fieldValue.length < rule) {
                    errorMessage = `${fieldName} min length is ${rule}`;
                    return true;
                }
                break;
            case "maxLength":
                if ([undefined, null, NaN, ""].indexOf(fieldValue) === -1 && fieldValue.length > rule) {
                    errorMessage = `${fieldName} max length is ${rule}`;
                    return true;
                }
                break;
            default:
                return false;
        }
    });

    if (invalidRuleIndex > -1) {
        return {
            valid: false,
            errorField: ruleNames[invalidRuleIndex],
            errorMessage,
        } as iFormDataValidationResult
    } else {
        return {
            valid: true,
            errorField: undefined,
            errorMessage: undefined,
        }
    }

}

function validateCustRules(formData, fieldName, fieldRules: iFormControlConfig__varCust[]): iFormDataValidationResult[] {
    const fieldValue = formData[fieldName];
    return fieldRules.map(rule => {
        if (rule.validateFn(fieldValue, formData) === false) {
            return {
                valid: false,
                errorField: fieldName,
                errorMessage: rule.message(fieldValue),
            } as iFormDataValidationResult
        } else {
            return {
                valid: true,
                errorField: undefined,
                errorMessage: undefined,
            }
        }
    });
}