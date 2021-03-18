import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input.js';
import Button from '../../shared/components/FormElements/Button.js';
import { useForm } from '../../shared/hooks/form-hook.js';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card.js';
import './NewPlace.css';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators.js';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner.js';
import ErrorModal from '../../shared/components/UIElements/ErrorModal.js';


// const PLACES = [
//     {
//         id: 'p1',
//         title: 'Empire State Building',
//         description: 'One of the most famous Sky scrappers in the world!',
//         imageUrl: 'https://lh3.googleusercontent.com/p/AF1QipMCXR42PGjcM-sbkMk9c4UbrHnqfOC-D3_F2Pil=h400-no',
//         address: '20 W 34th St, New York, NY 10001, United States',
//         location: {
//             lat: 40.7484402,
//             lng: -73.9943977
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: 'Empire State Building',
//         description: 'One of the most famous Sky scrappers in the world!',
//         imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipPVXL2PBY-7KHWwR4SybsxS47ZpMCaYV19cMT0w=w408-h512-k-no',
//         address: '20 W 34th St, New York, NY 10001, United States',
//         location: {
//             lat: 40.7484402,
//             lng: -73.9943977

//         },
//         creator: 'u2'
//     }
// ]

const UpdatePlace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    // const [isLoading, setIsLoading] = useState(true);
    const [loadedPlace, setLoadedPlace] = useState();

    const placeId = useParams().placeId;
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    // const identifiedPlace = PLACES.find(p => p.id === placeId);
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}}/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            } catch (err) {

            }
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);
    // useEffect(() => {
    //     if (identifiedPlace) {

    //     }

    //     setIsLoading(false);
    // }, [setFormData, identifiedPlace]);
    const placeUpdateSubmithandler = async event => {
        event.preventDefault();
        // console.log(formState.inputs);
        try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/' + auth.userId + '/places');
        }
        catch (err) { }
    };
    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner asOverlay />
            </div>);
    }
    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Couldn't identify a place!</h2>
                </Card>
            </div>);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (<form className="place-form" onSubmit={placeUpdateSubmithandler}>
                <Input id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    initialValue={loadedPlace.title}
                    initialValid={true} />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please entermin 5 characters."
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true} />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form>)}
        </React.Fragment>);
};



export default UpdatePlace;