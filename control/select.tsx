import * as React from "react";
import {RefObject} from "react";

import {iFormControlConfig_select} from "../form.type";
import {FormControl} from "./_form_control";
import ctrlStyles from "./_form_control.module.scss";

export class FC_Select extends FormControl {
    protected _config: iFormControlConfig_select;
    protected _controlRef: RefObject<HTMLSelectElement>;

    constructor(props) {
        super(props);
        this._config = this.props.config as iFormControlConfig_select;
    }

    protected _inputDom() {
        const config = this._config;
        return <div className={`${this._getClass()} ${ctrlStyles.select}`}>
            <select id={config.id} name={config.name}
                    style={config.style} ref={this._controlRef}
                    onChange={this._onChange}
                    value={this.props.ctrlState.value}
                    disabled={config.readOnly || config.disabled}
                    required={config.varAttr.required}
            >
                {
                    config.options.map((option, ind)=>{
                        return <option value={option[0]} key={ind}>{option[1]}</option>
                    })
                }
            </select>
            {this.props.children}
        </div>
    }

    protected _getValue = () => {
        let original: any = (this._controlRef?.current as HTMLSelectElement).value;
        if (typeof this._config.options[0][0] === "number") {
            original = parseFloat(original);
        }

        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}