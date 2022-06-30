import "./cust_sliderMMR.module.scss";

import * as React from "react";
import {RefObject} from "react";

import {vector3} from "../../../@type/graph";
import {jsType, jsTypeConvert} from "../../../@type/js.type";
import {float, int} from "../../../util/number";
import {iFormControlConfig_sliderMMR} from "../form.type";
import {FormControl} from "./_form_control";
import {iFormControlProps} from "./_form_control.type";
import styles from "./cust_sliderBar.module.scss";

interface iFC_Input_SliderMMRState {
    mmrSampleIndex: vector3<int>,   // [indexOfSample, indexOfSample, indexOfSamplePositive]
    mmr: vector3<float>,  // [min, max, range]
}

/**
 * sliderMMR value is [min, max, range] where range within the scope of min and max
 */
export class FC_Input_sliderMMR extends FormControl<iFormControlProps, iFC_Input_SliderMMRState> {
    protected _config: iFormControlConfig_sliderMMR;
    protected _mmrRefs: RefObject<HTMLInputElement>[] = [];
    protected _mmrSampleRange: vector3;
    protected _mmrSamplePositive: number[];

    constructor(props) {
        super(props);
        this._config = this.props.config as iFormControlConfig_sliderMMR;
        this._mmrSampleRange = [0, this._config.valueSample.length - 1, 1];
        this._mmrSamplePositive = this._config.valueSample[0] > 0 ? this._config.valueSample.slice() : this._config.valueSample.slice(this._config.valueSample.indexOf(0))

        const [vmin, vmax, vrange] = this.props.ctrlState.value as vector3;
        this.state = {
            mmrSampleIndex: [
                this._config.valueSample.indexOf(vmin),
                this._config.valueSample.indexOf(vmax),
                this._mmrSamplePositive.indexOf(vrange),

            ],
            mmr: this.props.ctrlState.value as vector3<float> || [this._config.valueSample[0], this._config.valueSample[1], 0],
        }
    }

    protected _inputDom() {
        const {mmr, mmrSampleIndex} = this.state;
        const config = this._config;
        const [min, max, step] = this._mmrSampleRange;


        return <div className={`${this._getClass()} ${styles["mmr-slider"]}`}>
            <input id={`${config.id}_min`} name={config.name} ref={this._mmrRefs[0]}
                   style={config.style}
                   onChange={(e) => {
                       mmrSampleIndex[0] = parseInt(e.currentTarget.value) || 0;
                       mmr[0] = config.valueSample[mmrSampleIndex[0]];

                       if (mmr[0] > mmr[1]) {
                           mmrSampleIndex[1] = mmrSampleIndex[0];
                           mmr[1] = mmr[0];
                       }

                       // @ts-ignore
                       const diff = (mmr[1] - mmr[0]).toFixed(2) - 0;
                       if (mmr[2] > diff) {
                           mmrSampleIndex[2] = this._mmrSamplePositive.findIndex((np, index) => {
                               return this._mmrSamplePositive[index + 1] > diff || np === diff;
                           });
                           mmrSampleIndex[2] = mmrSampleIndex[2] === -1 ? 0 : mmrSampleIndex[2];
                           mmr[2] = this._mmrSamplePositive[mmrSampleIndex[2]];
                       }

                       this._onChange()
                   }}
                   min={min}
                   max={max}
                   step={step}
                   value={mmrSampleIndex[0]}
                   type={"range"}
            />
            <input id={`${config.id}_max`} name={config.name} ref={this._mmrRefs[1]}
                   style={config.style}
                   onChange={(e) => {
                       mmrSampleIndex[1] = parseInt(e.currentTarget.value) || 0;
                       mmr[1] = config.valueSample[mmrSampleIndex[1]];

                       if (mmr[0] > mmr[1]) {
                           mmrSampleIndex[0] = mmrSampleIndex[1];
                           mmr[0] = mmr[1];
                       }

                       // @ts-ignore
                       const diff = (mmr[1] - mmr[0]).toFixed(2) - 0;
                       if (mmr[2] > diff) {
                           mmrSampleIndex[2] = this._mmrSamplePositive.findIndex((np, index) => {
                               return this._mmrSamplePositive[index + 1] > diff || np === diff;
                           });
                           mmrSampleIndex[2] = mmrSampleIndex[2] === -1 ? 0 : mmrSampleIndex[2];
                           mmr[2] = this._mmrSamplePositive[mmrSampleIndex[2]];
                       }

                       this._onChange()
                   }}
                   min={min}
                   max={max}
                   step={step}
                   value={mmrSampleIndex[1]}
                   type={"range"}
            />
            <input id={`${config.id}_range`} name={config.name} ref={this._mmrRefs[2]}
                   style={config.style}
                   onChange={(e) => {
                       mmrSampleIndex[2] = parseInt(e.currentTarget.value) || 0;
                       mmr[2] = this._mmrSamplePositive[mmrSampleIndex[2]];
                       this._onChange()
                   }}
                   min={0}
                   max={(()=> {
                       // @ts-ignore
                       const diff = (mmr[1] - mmr[0]).toFixed(2) - 0;
                       const index = this._mmrSamplePositive.findIndex((np, index) => {
                           return this._mmrSamplePositive[index + 1] > diff || np === diff;
                       })
                       return index === -1 ? this._mmrSamplePositive.length - 1 : index
                   })()}
                   step={1}
                   value={mmrSampleIndex[2]}
                   type={"range"}
            />
            {this.props.children}
        </div>
    }

    protected _getValue = (): number[] => {
        const original = jsTypeConvert(this.state.mmr, [jsType.float, 3]);
        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}