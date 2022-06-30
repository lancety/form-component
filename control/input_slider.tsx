import * as React from "react";
import {RefObject} from "react";

import {iFormControlConfig_slider} from "../form.type";
import {FormControl} from "./_form_control";
import ctrlStyles from "./_form_control.module.scss";


export class FC_Input_Slider extends FormControl {
    protected _config: iFormControlConfig_slider;
    protected _controlRef: RefObject<HTMLInputElement>

    constructor(props) {
        super(props);
        this._config = this.props.config as iFormControlConfig_slider;
    }

    protected _inputDom(){
        const config = this._config;
        const [min, max, step] = config.valueRange;

        return <div className={`${this._getClass()} ${ctrlStyles.slider}`}>
            <input id={config.id} name={config.name}
                   style={config.style} ref={this._controlRef}
                   onChange={this._onChange}
                   disabled={config.readOnly || config.disabled}
                   value={this._controlRef.current?.value || config.value}
                   type={"range"}
                   min={min}
                   max={max}
                   step={step}
                   required={config.varAttr.required}
            />
            {this.props.children}
        </div>
    }

    protected _getValue = (): number => {
        const original = parseFloat(this._controlRef.current.value);
        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}