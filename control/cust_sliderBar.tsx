import * as React from "react";
import {RefObject} from "react";

import {vector2} from "../../../@type/graph";
import {float} from "../../../util/number";
import {iFormControlConfig_sliderBar} from "../form.type";
import {FormControl} from "./_form_control";
import styles from "./cust_sliderBar.module.scss";

export class FC_Input_SliderBar extends FormControl {
    protected _config: iFormControlConfig_sliderBar;
    protected _controlRef: RefObject<HTMLInputElement>;
    readonly _offset: float;

    constructor(props) {
        super(props);

        this._config = this.props.config as iFormControlConfig_sliderBar;
        this._offset = this._config.valueRange[2] / 2;
    }

    protected _inputDom() {
        const config = this._config;
        let step = config.valueRange[1] - config.valueRange[0];
        step = Math.floor(step * 100) / 10000;

        return <div className={`${this._getClass()} ${styles["slider-bar"]}`}>
            <input id={config.id} name={config.name} ref={this._controlRef}
                   style={config.style}
                   onChange={this._onChange}
                   min={(config.valueRange[0] + this._offset).toFixed(2)}
                   max={(config.valueRange[1] - this._offset).toFixed(2)}
                   step={step}
                   type={"range"}
                   value={(this.props.ctrlState.value && this.props.ctrlState.value[0] + this._offset) || (config.valueRange[1] - config.valueRange[0]) / 2}
            />
            {this.props.children}
        </div>
    }

    protected _getValue = (): vector2 => {
        const value = parseFloat(this._controlRef.current?.value);
        const offset = this._config.valueRange[2] / 2;
        const original = [parseFloat((value - offset).toFixed(2)), parseFloat((value + offset).toFixed(2))];
        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}