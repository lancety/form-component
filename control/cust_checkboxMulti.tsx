import * as React from "react"
import { RefObject } from "react"

import { jsTypeConvert } from "../../../@type/js.type"
import { str_capitalise } from "../../../util/string"
import { iFormControlConfig_checkboxMulti } from "../form.type"
import { FormControl } from "./_form_control"
import { iFormControlProps } from "./_form_control.type"
import styles from "./cust_checkboxMulti.module.scss";

interface iFC_Input_CheckboxMultiState {
    boolList: boolean[],
}

export class FC_Input_CheckboxMulti extends FormControl<iFormControlProps, iFC_Input_CheckboxMultiState> {
    protected _config: iFormControlConfig_checkboxMulti
    protected _multiRef: RefObject<HTMLInputElement>[] = []

    constructor(props) {
        super(props)

        this._config = this.props.config as iFormControlConfig_checkboxMulti
        for (let i = 0; i < this._config.options.length; i++) {
            this._multiRef.push(React.createRef())
        }

        const defaultBool = Array(this._config.options.length).fill(false)
        this._config.options.forEach((opt, index) => {
            if (this.props.ctrlState.value.indexOf(opt[0]) >= 0) {
                defaultBool[index] = true
            }
        })
        this.state = {
            boolList: defaultBool,
        }
    }

    protected _inputDom() {
        const { boolList } = this.state
        const config = this._config

        return <div className={`${this._getClass()} ${styles.checkboxMulti}`}>
            <div className={styles["checkboxMulti-wrapper"]}>
                {
                    config.options.map((option, index) => {
                        const inputId = `${config.id}_${index}`

                        return <div key={inputId}>
                            <input id={inputId} name={config.name} ref={this._multiRef[index]}
                                   style={config.style}
                                   onChange={() => {
                                       boolList[index] = !boolList[index]
                                       this._onChange()
                                   }}
                                   checked={boolList[index]}
                                   disabled={config.readOnly || config.disabled}
                                   type={"checkbox"}
                                   required={config.varAttr.required}
                                   readOnly={config.readOnly}
                            />
                            <label htmlFor={inputId}>
                                {str_capitalise(option[1] || option[0])}
                            </label>
                        </div>
                    })
                }
            </div>
            {this.props.children}
        </div>
    }

    protected _getValue = (): any[] => {
        const { boolList } = this.state
        const inputValues = this._config.options.filter((opt, index) => boolList[index] === true).map(opt => {
            return opt[0]
        })
        const original = jsTypeConvert(inputValues, this._config.valueType);
        return this.props.config.getValueCB ? this.props.config.getValueCB(original) : original;
    }
}