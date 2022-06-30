import {CSSProperties} from "react";

import {vector2, vector3} from "../../@type/graph";
import {jsType, jsTypeDef} from "../../@type/js.type";

export interface iState_FormControl {
    value?: any,
    dirty?: boolean,
    valid?: boolean,
    disabled?: boolean,
}

export enum eFormControlType {
    text = "text",
    slider = "slider",
    color = "color",
    radio = "radio",
    checkbox = "checkbox",
    file = "input_file",
    datetime = "datetime",
    textarea = "textarea",
    select = "select",

    // custom control
    checkboxMulti = "checkboxMulti",
    sliders = "sliders",
    sliderMMR = "sliderMMR",
    sliderBar = "sliderBar",
}

export enum eFormControlTypeSub {
    text = "text",
    number = "number",
    range = "range",
    email = "email",
    password = "password",
    date = "date",
    time = "time",
    datetime = "datetime",
}

export interface iFormControlConfig__varCust {
    message: (value: string) => string,
    validateFn: (value: any, formData?: { [fieldName: string]: any }) => boolean,
}

/**
 * *** varAttr ***
 * required             [boolean]
 * pattern              [regex]     - text, search, url, tel, email, password
 * minLength, maxLength [integer]   - text, search, url, tel, email, password
 * min, max
 *      range,number  -   A valid number
 *      date, month, week - A valid date
 *      datetime, datetime-local, time    -   A valid date and time
 * step     [integer] date, mounth, week, datetime, datetime-local, time, range, number
 */
export interface iFormControlConfig_varAttr {
    required?: boolean,
    pattern?: string,   // string
    min?: any,
    max?: any,
    minLength?: number,
    maxLength?: number,
    step?: number,
}

// !!! DO NOT use Object property for storing value
export interface iFormControlConfig {
    name: string,                   // form control "name" attribute
    id?: string,                    // form control "id" attribute
    title?: string,                 // label display name
    classEndings?: Array<string>,   // pure css class WITHOUT css module reference
    value?: any,                    // default value
    type: eFormControlType,
    typeSub?: eFormControlTypeSub,  // sub type of input similar to text
    style?: CSSProperties,
    disabled?: boolean,
    readOnly?: boolean,
    hidden?: boolean,
    placeHolder?: string,
    placeHolderOnly?: boolean,      // without showing input label element

    /*
     native form control attribute for validation,
     because they have multi inputs cannot set to single formControlRef variable for validation, SO
     todo - DONT use in cust input config where _controlRef is not directly the getValue read from, e.g. datetime, radio, checkGroup, and "custom control" of eFormControlType
    */
    varAttr?: iFormControlConfig_varAttr,
    // custom functions for validate the input itself
    varCust?: iFormControlConfig__varCust[],

    rule?: iFormControlRule[], // rules that watch other fields' change

    getValueCB?: (newValue) => any,      // wrapper logic to process original form control value (business logic CB)
    changeCB?: Array<(newValue) => void>,     // after make change callback
    blurCB?: Array<(newValue) => void>,       // after blur callback
    // keep showing warn message even after the field lose focus
    // can be used for display value
    forceWarn?: ((val)=>string) | string,
}

export type iFormControlConfig_number = iFormControlConfig

export interface iFormControlConfig_slider extends iFormControlConfig {
    valueRange: [number, number, number],   // [min, max, step]
}

export type iFormControlConfig_password = iFormControlConfig

export interface iFormControlConfig_datetime extends iFormControlConfig {
    varAttr?: undefined,    // dont use this, use varCust instead
    displayFormat?: any,
}

export interface iFormControlConfig_radio extends iFormControlConfig {
    varAttr?: undefined,    // dont use this, use varCust instead
    options: Array<[any, string?]>,    // [value, displayName]
}

export interface iFormControlConfig_textarea extends iFormControlConfig {
    json?: boolean,
}

export interface iFormControlConfig_select extends iFormControlConfig {
    options: Array<[any, string?]>, // [value, displayName]
    optionsDefault?: number,    // index of options
}


/*
 * custom control
 */
export interface iFormControlConfig_checkboxMulti extends iFormControlConfig {
    value: unknown[],
    valueType: jsTypeDef,   // this tells how many number in the value array
    options: [any, string?][],
}

export interface iFormControlConfig_Sliders extends iFormControlConfig {
    value: unknown[],
    valueName: string[],    // the name amount is the value array's length
    valueLock?: boolean[],
    valueRange: [number, number, number],   // [min, max, step]

}

export interface iFormControlConfig_sliderMMR extends iFormControlConfig {
    value: vector3,     // [min, max, range]
    valueSample: number[],
}

export interface iFormControlConfig_sliderBar extends iFormControlConfig {
    valueRange: vector3,    // [min, max, range]
}

export enum iFormControlRule_operator {
    addition = "addition",
    subtraction = "subtraction",
    multiplication = "multiplication",
    division = "division",
    replace = "replace",
}

export enum iFormControlRule_Target {
    self = "self",
    watched = "watched",
}

export interface iFormControlRule {
    watchName: string,
    // either these
    operator: iFormControlRule_operator,
    operatorLeftSide: iFormControlRule_Target,
    // or this
    operateFn: (selfState: iState_FormControl, updatedState: iState_FormControl) => boolean    // updated result or undefined if no updates
}

