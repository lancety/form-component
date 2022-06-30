import React, {RefObject} from "react";

import {str_capitalise} from "../../../util/string";
import {iFormControlConfig_radio} from "../form.type";
import {FormControl} from "./_form_control";
import ctrlStyles from "./_form_control.module.scss";

export class FC_Input_Radio extends FormControl {
    constructor(props) {
        super(props);
    }

    protected _inputDom() {
        const config: iFormControlConfig_radio = this.props.config as any;
        return <div className={`${this._getClass()} ${ctrlStyles.radio}`}>
            {config.options.map(option => {
                const [value, displayName] = option;
                const inputName = config.name;
                const inputId = `${config.name}_${displayName}`;

                return <div className={ctrlStyles["form-control-radio-cont"]} key={inputId}>
                    <input id={inputId} name={inputName}
                           style={config.style}
                           type={"radio"}
                           title={this.getErrorMessage()}
                           disabled={config.readOnly || config.disabled}
                           value={value}
                           defaultChecked={this.props.ctrlState.value === value}
                           onClick={(e) => {
                               this._onClick(e, value)
                           }}
                    />
                    <label htmlFor={inputId}>
                        {str_capitalise(displayName)}
                    </label>
                </div>
            })}
            {this.props.children}
        </div>
    }

    protected _onClick = (e, option): void => {
        this._state_dirty = true;
        this._state_value = option;

        this._validate();
        this._runChangeCB();
        this._onChange_preSetState();
        this._updateState();
    };
}