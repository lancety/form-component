import React, {Component, CSSProperties} from "react"

import {jsonCopy, jsonEqual} from "../../util/json"
import {str_capitaliseMulti} from "../../util/string";
import btnStyles from "../btn/btn.module.scss";
import alertStyles from "../popup/alert.module.scss";
import {FormControl} from "./control/_form_control"
import ctrlStyles from "./control/_form_control.module.scss";
import {FC_Input_CheckboxMulti} from "./control/cust_checkboxMulti";
import {FC_Input_SliderBar} from "./control/cust_sliderBar";
import {FC_Input_sliderMMR} from "./control/cust_sliderMMR";
import {FC_Input_Sliders} from "./control/cust_sliders";
import {FC_Input_CheckBox} from "./control/input_checkbox";
import {FC_Input_DateTime} from "./control/input_datetime";
import {FC_Input_Radio} from "./control/input_radio"
import {FC_Input_Slider} from "./control/input_slider";
import {FC_Input_Text} from "./control/input_text"
import {FC_Select} from "./control/select";
import {FC_Textarea} from "./control/textarea"
import {
    eFormControlType,
    iFormControlConfig,
    iFormControlRule,
    iFormControlRule_operator,
    iFormControlRule_Target,
    iState_FormControl,
} from "./form.type"
import styles from "./form_factory.module.scss";

interface iAP_FormFactory {
    formId: string,
    formSubmitText?: string,
    formSubmitFn?: (formData: unknown) => void, // async function
    extraBtns?: JSX.Element[],
    configs: Array<iFormControlConfig>,
    stateUpdateFn?: (formData: unknown, formValid: boolean) => void,    // form update callback
    fieldUpdateFn?: (fieldName: string, fieldData: unknown) => void,                       // field update callback when valid
    styles?: CSSProperties,
}

interface iState_FormFactoryControl {
    config: iFormControlConfig,
    state: iState_FormControl,
    ref: FormControl,
}

interface iState_FormFactory {
    formState: { [fieldName: string]: iState_FormFactoryControl },
    formValid: boolean,
    alertDom: JSX.Element,
}

export class FormFactory extends Component<iAP_FormFactory, iState_FormFactory> {
    public alertRef;
    public formRef;

    constructor(props) {
        super(props)

        this.alertRef = React.createRef();
        this.formRef = React.createRef()
        this.state = {
            formState: this._initStates(),
            formValid: false,
            alertDom: undefined,
        }
    }

    componentDidMount() {
        this._initValues();
        this._formValidate();
    }

    render() {
        const {formState} = this.state;

        return <React.Fragment>
            <form id={this.props.formId} className={styles[this._formValidateClass()]} ref={this.formRef}
                  style={this.props.styles}>
                {Object.keys(formState).map((fieldKey) => {
                    const ctrlInstance = formState[fieldKey] as iState_FormFactoryControl;
                    const fieldConfig = ctrlInstance.config;
                    const fieldState = ctrlInstance.state;
                    const fieldRef = ctrlInstance.ref;

                    if (fieldConfig.hidden) {
                        return <div className={`${styles["form-control-container"]} ${ctrlStyles["form-control-container"]} ${styles.hidden}`} key={ctrlInstance.config.name}>
                            {this._formControlSwitch(ctrlInstance)}
                        </div>
                    } else {
                        let warnPopup, errorPopup;
                        if (fieldRef) {
                            if (fieldState.dirty && !fieldState.valid) {
                                errorPopup = <div className={`${ctrlStyles.popup} ${ctrlStyles["popup--error"]}`}>
                                    {fieldRef.getErrorMessage()}
                                </div>
                            } else if (fieldConfig.forceWarn) {
                                let msg;
                                if (typeof fieldConfig.forceWarn === "function") {
                                    msg = fieldRef.controlValue ? fieldConfig.forceWarn(fieldRef.controlValue) : null
                                } else {
                                    msg = fieldConfig.forceWarn || null;
                                }
                                warnPopup = <div className={`${ctrlStyles.popup} ${ctrlStyles["popup--warn"]}`}>{msg}</div>
                            }
                        }

                        return <div className={`${styles["form-control-container"]} ${ctrlStyles["form-control-container"]}`} key={ctrlInstance.config.name}>
                            {this._formControlSwitch(ctrlInstance, errorPopup || warnPopup)}
                        </div>
                    }
                })}
                {
                    this.props.formSubmitFn ?
                        <div className={`${styles["form-control-container"]} ${ctrlStyles["form-control-container"]} ${styles["form-control-btns"]}`}>
                            <div className={ctrlStyles["form-control-label"]}/>
                            <div className={`${styles["form-control"]} ${ctrlStyles["form-control"]}`}>
                                <button type={"button"}
                                        className={`${btnStyles.btn} ${this.state.formValid ? btnStyles["btn-blue"] : btnStyles["btn-light"]} ${btnStyles["btn-form-submit"]} ${styles["btn-form-submit"]}`}
                                        disabled={!this.state.formValid}
                                        onClick={this._formSubmit}>
                                    {str_capitaliseMulti(this.props.formSubmitText)}
                                </button>
                                {this.props.extraBtns}
                            </div>
                        </div>
                        : null
                }
            </form>
            <div className={alertStyles["alert-cont"]} ref={this.alertRef}>
                {this.state.alertDom}
            </div>
        </React.Fragment>
    }

    private _formControlSwitch(formControl: iState_FormFactoryControl, popup: any = null) {
        const config = formControl.config;
        const attrs = {
            config,
            key: config.id || config.name,
            onRef: (ref) => {
                formControl.ref = ref;
            },
            ctrlState: formControl.state,
            updateState: this._updateState,
        }
        switch (config.type) {
            case eFormControlType.textarea:
                return <FC_Textarea {...attrs}>{popup}</FC_Textarea>
            case eFormControlType.select:
                return <FC_Select {...attrs}>{popup}</FC_Select>

            /* below are input DOMs */
            case eFormControlType.text:
                return <FC_Input_Text {...attrs}>{popup}</FC_Input_Text>
            case eFormControlType.slider:
                return <FC_Input_Slider {...attrs}>{popup}</FC_Input_Slider>
            case eFormControlType.checkbox:
                return <FC_Input_CheckBox {...attrs}>{popup}</FC_Input_CheckBox>
            case eFormControlType.radio:
                return <FC_Input_Radio {...attrs}>{popup}</FC_Input_Radio>
            case eFormControlType.datetime:
                return <FC_Input_DateTime {...attrs}>{popup}</FC_Input_DateTime>

            // custom input control
            case eFormControlType.checkboxMulti:
                return <FC_Input_CheckboxMulti {...attrs}>{popup}</FC_Input_CheckboxMulti>;
            case eFormControlType.sliders:
                return <FC_Input_Sliders {...attrs}>{popup}</FC_Input_Sliders>;
            case eFormControlType.sliderMMR:
                return <FC_Input_sliderMMR {...attrs}>{popup}</FC_Input_sliderMMR>;
            case eFormControlType.sliderBar:
                return <FC_Input_SliderBar {...attrs}>{popup}</FC_Input_SliderBar>
        }
    }

    get formData() {
        const data = {};
        for (const fieldKey in this.state.formState) {
            const value = this.state.formState[fieldKey].state.value;
            if ([undefined, null, ""].indexOf(value) === -1) {
                data[fieldKey] = this.state.formState[fieldKey].state.value;
            }
        }
        return data;
    }


    private _formSubmit = async (e) => {
        e.preventDefault()
        this._formValidate();

        if (this.state.formValid) {
            const data = this.formData;
            // internal logic

            // external logic
            await this.props.formSubmitFn(data);
        }
    }

    private _formValidateClass = () => {
        switch (this.state.formValid) {
            case true:
                return "valid"
            case false:
                return "invalid"
            case undefined:
                return ""
        }
    }

    private _formValidateCheck(): boolean {
        // native form validity
        if (!this.formRef.current.checkValidity()) {
            return false;
        }

        // custom form validity
        const invalidCount = Object.keys(this.state.formState).filter(fieldName => {
            const control = this.state.formState[fieldName];
            const inputState = control.state;

            if (inputState.dirty) {
                return inputState.valid !== true;
            } else {
                return control.ref?.validateCust() >= 0;
            }
        }).length

        return invalidCount === 0;
    }

    private _formValidate = () => {
        this.setState({
            formValid: this._formValidateCheck(),
        })
    }

    private _initStates(): iState_FormFactory["formState"] {
        const formState: iState_FormFactory["formState"] = {}
        this.props.configs.forEach((config) => {
            const formCtrlState: iState_FormControl = {
                value: [undefined, null, ""].indexOf(config.value) >= 0 ? "" : config.value,
                valid: false,
                dirty: false,
            }
            this._initStates_checkValueFormat(config.type, formCtrlState);
            formState[config.name] = {
                config,
                state: formCtrlState,
                ref: undefined,
            }
        })

        return formState
    }

    private _initStates_checkValueFormat(ctrlType: eFormControlType, state: iState_FormControl) {
        switch (ctrlType) {
            case eFormControlType.checkboxMulti:
                if (state.value && Array.isArray(state.value) === false) {
                    state.value = [state.value];
                }
        }
    }

    private _initValues() {
        this.props.configs.forEach((config) => {
            if (config.value) {
                const name = config.name
                const fieldState = this.state.formState[name]
                this._updateState(name, fieldState.state)
            }
        })
    }

    private _updateState = (name, fieldState: iState_FormControl) => {
        const control = this.state.formState[name]
        if (jsonEqual(control.state, fieldState)) {
            return
        }
        // update state list item
        Object.assign(control.state, fieldState)
        // run rule to update other item's value
        this._runRule(name, control.state)
        // update self state
        this.setState({
            formState: Object.assign(this.state.formState, {
                [name]: control,
            }),
            formValid: this._formValidateCheck(),
        })

        if (this.state.formValid) {
            this.props.stateUpdateFn && this.props.stateUpdateFn(this.formData, true);
            this.props.fieldUpdateFn && this.props.fieldUpdateFn(name, control.state.value);
        }
    }

    private _runRule = (updatedCtrlName: string, updatedState: iState_FormControl) => {
        this.props.configs.forEach((config: iFormControlConfig, index) => {
            const fieldName = config.name;
            const fieldState = this.state.formState[fieldName];
            config.rule && config.rule.forEach((rule: iFormControlRule, ruleInd) => {
                if (rule.watchName === updatedCtrlName) {
                    const ctrlState_copy = jsonCopy(fieldState.state);

                    if (rule.operateFn) {
                        const updatedCtrlState = rule.operateFn.bind(config)(ctrlState_copy, updatedState, updatedCtrlName)
                        updatedCtrlState && this._updateState(fieldName, updatedCtrlState)
                    } else {
                        switch (rule.operator) {
                            case iFormControlRule_operator.addition:
                                ctrlState_copy.value += updatedState.value
                                this._updateState(fieldName, ctrlState_copy)
                                break
                            case iFormControlRule_operator.multiplication:
                                ctrlState_copy.value *= updatedState.value
                                this._updateState(fieldName, ctrlState_copy)
                                break
                            case iFormControlRule_operator.subtraction:
                                if (rule.operatorLeftSide === iFormControlRule_Target.self) {
                                    ctrlState_copy.value -= updatedState.value
                                } else {
                                    ctrlState_copy.value = updatedState.value - ctrlState_copy.value
                                }
                                this._updateState(fieldName, ctrlState_copy)
                                break
                            case iFormControlRule_operator.division:
                                if (rule.operatorLeftSide === iFormControlRule_Target.self) {
                                    ctrlState_copy.value /= updatedState.value
                                } else {
                                    ctrlState_copy.value = updatedState.value / ctrlState_copy.value
                                }
                                this._updateState(fieldName, ctrlState_copy)
                                break
                        }
                    }
                }
            })
        })
    }
}