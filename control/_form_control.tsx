import * as React from "react"
import {Component, RefObject} from "react"

import {int} from "../../../util/number";
import {str_capitaliseMulti} from "../../../util/string";
import {iFormControlConfig, iFormControlConfig__varCust} from "../form.type"
import styles from "./_form_control.module.scss";
import {iFormControlProps} from "./_form_control.type";


export class FormControl<P extends iFormControlProps = iFormControlProps, S = unknown> extends Component<P, S> {
    protected _config: iFormControlConfig           // redefine if type not same in sub class
    protected _controlRef: RefObject<HTMLElement>   // set value in this class
    protected _state_value_focus = undefined
    protected _state_value = undefined
    protected _state_dirty = false
    protected _state_invalidValidationIndex = -1     // -1: no error;  999: native validation error, 1-999: varCust error index

    // used by external logic
    get controlRef() {
        return this._controlRef;
    }

    get controlValue() {
        return this._getValue();
    }

    constructor(props: P) {
        super(props)

        this.props.config.varAttr = this.props.config.varAttr || {}
        this._controlRef = React.createRef()
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    componentDidUpdate() {
        //console.log(this._props.config.name, "updated");
    }

    render() {
        try {
            return (
                <React.Fragment>
                    {this._labelDom()}
                    {this._inputDom()}
                </React.Fragment>
            )
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * render() defined in child class
     */

    protected _labelDom() {
        const config = this.props.config;
        return config.placeHolderOnly ? null :
            <React.Fragment>
                <label className={styles["form-control-label"]} htmlFor={config.name}>{str_capitaliseMulti(config.title || config.name)}</label>&nbsp;
            </React.Fragment>;
    }

    protected _inputDom() {

    }

    protected _updateState = () => {
        const newState = {
            value: [false, 0, ""].indexOf(this._state_value) >= 0 ? this._state_value : this._state_value || "",
            dirty: this._state_dirty,
            valid: this._state_invalidValidationIndex === -1,
        }
        this.props.updateState(this.props.config.name, newState)
    }

    protected _getClass = (): string => {
        const config = this.props.config;
        const classes = [
            styles["form-control"],
            config.classEndings ? config.classEndings.map(ending => styles[ending]).join(" ") : "",
            config.readOnly ? styles["read-only"] : "",
            this._state_dirty ? styles.dirty : "",
        ];
        if (this._hasError()) {
            classes.push(styles.invalid);
        } else if (this.props.config.forceWarn) {
            classes.push(styles.warned);
        }
        return classes.join(" ");
    }
    protected _getValue = (): any => {
        const original = (this._controlRef?.current as HTMLFormElement).value;
        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }

    protected _hasError = () => {
        return this._state_invalidValidationIndex !== -1
    }


    /**
     * action handler - change value
     */
    protected _runChangeCB() {
        if (this._state_invalidValidationIndex === -1) {
            // if valid then do stuff
            if (Array.isArray(this.props.config.changeCB)) {
                this.props.config.changeCB.forEach(fn => {
                    fn(this._state_value)
                })
            }
        }
    }

    protected _onChange_preSetState = (): void => {

    }
    protected _onChange = (): void => {
        // child implement get value method
        this._state_dirty = true
        this._state_value = this._getValue()

        this._validate()
        this._onChange_preSetState()
        this._updateState()     // notice change to all watching controls
        this._runChangeCB()     // notice change to self
    }


    /**
     * action handler - focus, blur
     */
    protected _onFocus = (): void => {
        this._state_value_focus = this._state_value
    }

    protected _runBlurCB() {
        if (this._state_invalidValidationIndex === -1) {
            // if valid then do stuff
            if (Array.isArray(this.props.config.blurCB)) {
                this.props.config.blurCB.forEach(fn => {
                    fn(this._state_value)
                })
            }
        }
    }

    protected _onBlur_preSetState = (): void => {

    }
    protected _onBlur = (): void => {
        if (this._state_value === this._state_value_focus) {
            return
        }
        this._validate()
        this._onBlur_preSetState()
        this._updateState()
        this._runBlurCB()
    }

    /**
     * validation logic
     */
    protected _validate() {
        const {config} = this.props

        if (!this._state_dirty) {
            return
        }
        if (this._state_value === "" && !config.varAttr.required) {
            return
        }

        const formControl = (this._controlRef?.current as any)
        if (formControl && formControl.checkValidity && !formControl.checkValidity()) {
            this._state_invalidValidationIndex = 999
            return
        }

        if (config.varCust) {
            this._state_invalidValidationIndex = this._validateCust();
        } else {
            this._state_invalidValidationIndex = -1
        }
    }

    protected _validateCust(): int {
        const {config} = this.props
        if (config.varCust) {
            return config.varCust.findIndex((validation: iFormControlConfig__varCust, index) => {
                return validation.validateFn(this._getValue()) === false;
            })
        } else {
            return -1;
        }

    }

    public validateCust = () => {
        return this._validateCust();
    }

    public getErrorMessage = (): string => {
        if (!this._hasError()) {
            return;
            //todo return this._props.config.placeHolder || this._props.config.title
        }

        if (this._state_invalidValidationIndex === 999) {
            const formControl = (this._controlRef?.current as any)
            return formControl.validationMessage
        }

        const validationConfig = this.props.config.varCust[this._state_invalidValidationIndex]
        if (!validationConfig) {
            return
        }
        if (typeof validationConfig.message === "function") {
            return validationConfig.message(this._getValue())
        } else {
            return validationConfig.message
        }
    }
}