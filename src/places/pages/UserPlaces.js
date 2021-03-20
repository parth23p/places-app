import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';


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
//         title: 'Empir2 State Building',
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
const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/user/${userId}`

                );
                setLoadedPlaces(responseData.places);
            } catch (err) {

            }
        };
        fetchPlaces();
    }, [sendRequest, userId]);
    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces =>
            prevPlaces.filter(place => place.id !== deletedPlaceId));
    };
    // const loadedPlaces = PLACES.filter(place => place.creator === userId);
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div><LoadingSpinner asOverlay /></div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </React.Fragment>);
};

export default UserPlaces;