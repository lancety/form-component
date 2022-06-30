import React from "react";

import {dateUtil} from "../../../util/date";
import {eFormControlTypeSub, iFormControlConfig_datetime} from "../form.type";
import {FormControl} from "./_form_control";
import ctrlStyles from "./_form_control.module.scss";
import {iFormControlProps} from "./_form_control.type";

interface iFC_Input_DateTimeState {
    dateValue: string,
    timeValue: string,
}

export class FC_Input_DateTime extends FormControl<iFormControlProps, iFC_Input_DateTimeState> {
    protected _config: iFormControlConfig_datetime;
    readonly _dateRef: React.RefObject<HTMLInputElement>;
    readonly _timeRef: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);
        this._config = this.props.config as any;

        const {value} = this._config;
        this.state = {
            // date value of date input is always yyyy-mm-dd
            dateValue: value ? dateUtil.getShortDate(value, "-") : undefined,
            timeValue: value ? dateUtil.getShortTime(value, ":") : undefined,
        }
    }

    private _dateDom() {
        switch (this._config.typeSub) {
            case eFormControlTypeSub.date:
            case eFormControlTypeSub.datetime:
                return <input type="date" ref={this._dateRef}
                              disabled={this._config.readOnly || this._config.disabled}
                              value={this.state.dateValue}
                              onChange={this._dateChange}/>;
        }
    }

    private _dateChange = (event) => {
        // console.log("change to ", event.target.value)
        this.setState({
            dateValue: event.target.value
        })
    }

    private _timeDom() {
        switch (this._config.typeSub) {
            case eFormControlTypeSub.time:
            case eFormControlTypeSub.datetime:
                return <input type="time" ref={this._timeRef}
                              disabled={this._config.readOnly || this._config.disabled}
                              value={this.state.timeValue}
                              onChange={this._timeChange}/>;
        }
    }

    private _timeChange = (event) => {
        // console.log("change to ", event.target.value)
        this.setState({
            timeValue: event.target.value
        })
    }

    protected _inputDom() {
        return <div className={`${this._getClass()} ${ctrlStyles.datetime}`}>
            {this._dateDom()} {this._timeDom()}
        </div>
    }

    protected _getValue = ()=> {
        let inputTimestamp = this._dateRef.current.valueAsNumber + this._timeRef.current.valueAsNumber;
        inputTimestamp += new Date().getTimezoneOffset() * 60 * 1000;
        return this.props.config.getValueCB ? this.props.config.getValueCB(inputTimestamp) : inputTimestamp;
    }
}