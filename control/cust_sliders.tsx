import * as React from "react";
import {RefObject} from "react";

import {jsType, jsTypeConvert} from "../../../@type/js.type";
import {iFormControlConfig_Sliders} from "../form.type";
import {FormControl} from "./_form_control";
import {iFormControlProps} from "./_form_control.type";

interface iFC_Input_SlidersState {
    numberList: number[],
}

/**
 * sliders have N slider inputs, each one have their label. Value is array of numbers represent each label
 */
export class FC_Input_Sliders extends FormControl<iFormControlProps, iFC_Input_SlidersState> {
    protected _config: iFormControlConfig_Sliders;
    protected _numRefs: RefObject<HTMLInputElement>[] = [];
    protected _numLength: number;

    constructor(props) {
        super(props);
        this._config = this.props.config as iFormControlConfig_Sliders;
        this._numLength = this._config.valueName.length;

        const numberList = [];
        if (this.props.ctrlState.value) {
            numberList.push(...this.props.ctrlState.value);
        } else {
            for (let i = 0; i < this._numLength; i++) {
                numberList.push(undefined);
            }
        }

        for (let i = 0; i < this._numLength; i++) {
            this._numRefs.push(React.createRef());
        }

        this.state = {
            numberList,
        }
    }

    protected _inputDom() {
        const {numberList} = this.state;
        const config = this._config;
        const [min, max, step] = config.valueRange;
        const labelWidth = 80;

        return <div className={this._getClass() + " sliders"}>
            {
                this._numRefs.map((ignore, index) => {
                    const inputId = `${config.id}_${index}`;
                    return <div key={inputId}>
                        <input id={inputId} name={config.name} ref={this._numRefs[index]}
                               style={{...config.style, width: `calc( 100% - ${labelWidth}px )`}}
                               onChange={(e) => {
                                   numberList[index] = parseFloat(e.currentTarget.value);
                                   this._onChange()
                               }}
                               min={min}
                               max={max}
                               step={step}
                               value={numberList[index]}
                               disabled={(config.readOnly || config.disabled) || (config.valueLock && config.valueLock[index])}
                               type={"range"}
                               required={config.varAttr.required}
                        />
                        <label style={{width: `${labelWidth}px`, verticalAlign: "top"}}> {config.valueName[index]}:{numberList[index]}</label>
                    </div>
                })
            }
            {this.props.children}
        </div>
    }

    protected _getValue = (): number[] => {
        const original = jsTypeConvert(this.state.numberList, [jsType.float, this._numLength]);
        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}