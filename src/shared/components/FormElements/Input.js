import React, { useReducer, useEffect } from 'react';
import './Input.css';
import { validate } from '../../util/validators';


const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            {
                return {
                    ...state,
                    isTouched: true

                }
            }
        default:
            return state;
    }
};
const Input = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',
        isTouched: false,
        isValid: props.initialValid || false
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;
    useEffect(() => {
        props.onInput(props.id, inputState.value, inputState.isValid)
    }, [id, value, isValid, onInput]);
    //    useReducer is used to manage interrelated complex states instead of comlex states
    // useReducer is a function that accepts action and an state array as an argument and re-render acc. to function
    const changeHandler = event => {
        dispatch({ type: 'CHANGE', val: event.target.value, validators: props.validators });
    };
    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };
    const element = props.element === 'input' ?
        (<input id={props.id}
            type={props.type}
            onBlur={touchHandler}
            onChange={changeHandler}
            placeholder={props.placeholder}
            value={inputState.value} />)
        : (<textarea
            id={props.id}
            rows={props.row || 3}
            onChange={changeHandler}
            value={inputState.value} />);
    return (<div className={`form-control ${!inputState.isValid && inputState.isTouched && `form-control--invalid`}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>);
};
export default Input;
