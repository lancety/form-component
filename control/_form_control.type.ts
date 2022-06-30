import {iFormControlConfig, iState_FormControl} from "../form.type";

export interface iFormControlProps {
    config: iFormControlConfig,
    // ctrlState is shared from form scope
    ctrlState: iState_FormControl,
    // ctrlState object is modified from control/input scope by calling updateState(), child mock a new state obj everytime change made
    updateState: (controlName: string, newState: iState_FormControl) => void,
    // control/input register its input ref to form scope's formState
    onRef: (ref) => void,
}

/**
 * form control base class dont maintain state, if child class need, just define in their own class
 */
// export interface iFormControlState {
//
// }