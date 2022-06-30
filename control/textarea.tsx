import React, {RefObject} from "react"

import {iFormControlConfig_textarea} from "../form.type"
import {FormControl} from "./_form_control"
import ctrlStyles from "./_form_control.module.scss";

export class FC_Textarea extends FormControl {
    protected _config: iFormControlConfig_textarea;
    protected _controlRef: RefObject<HTMLTextAreaElement>;

    private _jsonValidator = {
        validateFn: (): boolean => {
            return this._canParseJSON() !== undefined
        },
        message: () => "Could not convert to JSON",
    };

    constructor(props) {
        super(props)
        this._config = this.props.config;
    }

    componentDidMount() {
        super.componentDidMount();
        if (this._config.json) {
            this._config.varCust = this._config.varCust || [];
            this._config.varCust.unshift(this._jsonValidator)
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this._config.json) {
            const jsonValidatorInd = this._config.varCust.indexOf(this._jsonValidator);
            jsonValidatorInd >= 0 && this._config.varCust.splice(jsonValidatorInd, 1);
        }
    }

    protected _inputDom() {
        const config: iFormControlConfig_textarea = this.props.config
        return <div className={`${this._getClass()} ${ctrlStyles.textarea}`}>
            <textarea id={config.id} name={config.name}
                      style={config.style} ref={this._controlRef}
                      onChange={this._onChange}
                      onFocus={this._onFocus}
                      onBlur={this._onBlur}
                      value={this.props.ctrlState.value}
                      disabled={config.readOnly || config.disabled}
                      title={this.getErrorMessage()}
                      required={config.varAttr.required}
                      minLength={config.varAttr.minLength}
                      maxLength={config.varAttr.maxLength}
                      placeholder={config.placeHolder}
            />
            {this.props.children}
        </div>
    }

    protected _onChange_preSetState = () => {
        this._validate()
    }

    protected _onBlur_preSetState = () => {
        const config: iFormControlConfig_textarea = this.props.config
        if (config.json) {
            this._state_value = this._prettyPrint()
        } else {
            this._state_value = this._controlRef.current.value
        }
    }

    private _prettyPrint() {
        const parseResult = this._canParseJSON()
        if (parseResult) {
            return parseResult
        } else {
            return this._controlRef.current.value
        }
    }

    private _canParseJSON() {
        try {
            const obj = JSON.parse(this._controlRef.current.value);
            return JSON.stringify(obj, undefined, 2)
        } catch (e) {
            return undefined
        }
    }
}