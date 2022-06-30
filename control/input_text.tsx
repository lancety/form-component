import React, {RefObject} from "react"

import {eFormControlTypeSub, iFormControlConfig} from "../form.type"
import {FormControl} from "./_form_control"
import ctrlStyles from "./_form_control.module.scss";

export class FC_Input_Text extends FormControl {
    protected _controlRef: RefObject<HTMLInputElement>

    constructor(props) {
        super(props)
    }

    protected _inputDom(){
        const config: iFormControlConfig = this.props.config;
        return <div className={`${this._getClass()} ${ctrlStyles.text}`}>
            <input id={config.id} name={config.name}
                   style={config.style} ref={this._controlRef}
                   onFocus={this._onFocus}
                   onChange={this._onChange}
                   onBlur={this._onBlur}
                   value={this.props.ctrlState.value}
                   disabled={config.readOnly || config.disabled}
                   type={config.typeSub || "text"}
                   title={this.getErrorMessage()}
                   required={config.varAttr.required}
                   pattern={config.varAttr.pattern}
                   minLength={config.varAttr.minLength}
                   maxLength={config.varAttr.maxLength}
                   min={config.varAttr.min}
                   max={config.varAttr.max}
                   placeholder={config.placeHolder}
            />
            {this.props.children}
        </div>
    }

    protected _getValue = () => {
        let original: string | number = this._controlRef.current.value;
        switch (this.props.config.typeSub) {
            case eFormControlTypeSub.number:
                original = parseFloat(original);
                break;
            case eFormControlTypeSub.email:

                break;
        }

        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}