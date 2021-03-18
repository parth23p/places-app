import React, { useCallback, useReducer, useContext } from 'react';
import './NewPlace.css';
import { useHistory } from 'react-router-dom';
// useHistory is inbuilt hook

import Input from '../../shared/components/FormElements/Input.js';
import Button from '../../shared/components/FormElements/Button.js';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { useForm } from '../../shared/hooks/form-hook.js';
import { AuthContext } from '../../shared/context/auth-context';


// const formReducer = (state, action) => {
//     switch (action.type) {
//         case 'INPUT_CHANGE':
//             let formIsvalid = true;

//             for (const inputId in state.inputs) {
//                 if (inputId === action.inputId) {
//                     formIsvalid = formIsvalid && action.isValid;
//                 } else {
//                     formIsvalid = formIsvalid && state.inputs[inputId].isValid;
//                 }
//             }

//             return {
//                 ...state,
//                 inputs: {
//                     ...state.inputs,
//                     [action.inputId]: { value: action.value, isValid: action.isValid }
//                 },
//                 isValid: formIsvalid

//             };
//         default:
//             return state;
//     }
// };


const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, Inputhandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const history = useHistory();

    const placeSubmithandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('image', formState.inputs.image.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('creator', auth.userId);

            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places',
                'POST',
                // JSON.stringify({
                //     title: formState.inputs.title.value,
                //     description: formState.inputs.description.value,
                //     address: formState.inputs.address.value,
                //     creator: auth.userId
                // }),
                formData,
                { Authorization: 'Bearer ' + auth.token }
                // {
                //     'Content-Type': 'application/json'
                // }
            );
            history.push('/');
            // history.push('/') redirects user to homepage i.e '/' after successfull insertion of newplace  in database
            //Redirect the user to differnt page
        }
        catch (err) {

        }
    }
    // const descriptionInputhandler = useCallback((id, value, isValid) => { }, []);
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <form className="place-form" onSubmit={placeSubmithandler}>
                <Input element='input'
                    id="title"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title!"
                    onInput={Inputhandler}
                />
                <Input element='textarea'
                    id="description"
                    type="text"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description(atleast 5 characters long)!"
                    onInput={Inputhandler}
                />
                <Input element='input'
                    id="address"
                    type="text"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address(atleast 5 characters long)!"
                    onInput={Inputhandler}
                />
                <ImageUpload
                    id="image"
                    onInput={Inputhandler}
                    errorText="Please provide an image!"
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>);
};
export default NewPlace;