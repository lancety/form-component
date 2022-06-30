import * as React from "react";
import {RefObject} from "react";

import {iFormControlConfig} from "../form.type";
import {FormControl} from "./_form_control";
import ctrlStyles from "./_form_control.module.scss";


export class FC_Input_CheckBox extends FormControl {
    protected _controlRef: RefObject<HTMLInputElement>

    constructor(props) {
        super(props);
    }

    protected _inputDom(){
        const config: iFormControlConfig = this.props.config;
        return <div className={`${this._getClass()} ${ctrlStyles.checkbox}`}>
            <input id={config.id} name={config.name}
                   style={config.style} ref={this._controlRef}
                   onChange={this._onChange}
                   checked={this.props.ctrlState.value}
                   disabled={config.readOnly || config.disabled}
                   type={"checkbox"}
                   required={config.varAttr.required}
            />
            {this.props.children}
        </div>
    }

    protected _getValue = (): boolean => {
        const original = this._controlRef.current.checked;
        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}