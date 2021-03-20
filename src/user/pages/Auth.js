import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card.js';
import Input from '../../shared/components/FormElements/Input.js';
import Button from '../../shared/components/FormElements/Button.js';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators.js';
import { useForm } from '../../shared/hooks/form-hook.js';
import { AuthContext } from '../../shared/context/auth-context.js';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, Inputhandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);


    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    };
    const authSubmitHandler = async (event) => {
        event.preventDefault();

        console.log(formState.inputs);
        if (isLoginMode) {

            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId, responseData.token);
            }
            catch (err) {

            }

        } else {
            try {
                const formData = new FormData();
                // form is built in in browser into js and it is a browser api
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    formData,

                    // form data automatically set right headers so don't needed to specify header explicityly
                    // {
                    //     'Content-Type': 'application/json'
                    // }
                );
                auth.login(responseData.userId, responseData.token);
                // const responseData = await response.json();
                // if (!response.ok) {
                //     throw new Error(responseData.message);
                // }
                // // if (response.ok) will allow res.statusCode:200 and deny ststus code 422,404,500
                // console.log(responseData);
                // setIsLoading(false);

            }
            catch (err) {
                //
                // console.log(err);
                // setIsLoading(false);
                // setError(err.message || 'Something went wrong,please try again');
            }
        }

    };
    // const errorHandler = () => {
    //     setError(null);
    // };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode &&
                        (<Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE]}
                            errorText="Please enter a Name"
                            onInput={Inputhandler}
                        />)
                    }

                    {!isLoginMode && (
                        <ImageUpload
                            center
                            id="image"
                            onInput={Inputhandler}
                            errorText="please provide an image!"
                        />)}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText='Please enter a valid E-mail!'
                        onInput={Inputhandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText='Please enter a valid Password, at least 6 characters.'
                        onInput={Inputhandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? "LOGIN" : "SIGN UP"}
                    </Button>

                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
                </Button>
            </Card>
        </React.Fragment>);
};
export default Auth;