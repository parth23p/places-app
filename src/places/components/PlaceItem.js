import React, { useState, useContext } from 'react';
import './PlaceItem.css';
import Button from '../../shared/components/FormElements/Button';

import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context.js';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const PlaceItem = (props) => {
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        // console.log("DELETING.....");
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
                'DELETE',
                //   body:null
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            props.onDelete(props.id);
        }
        catch (err) {

        }
    };
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />

            <Modal show={showMap}
                onCancle={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="plce-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancle={cancelDeleteHandler}
                // onClick={confirmDeleteHander}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>

                    </React.Fragment>
                }>
                <p>Do You want to proceed and delete this place? Please note that it can't be undone </p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.userId === props.creator && (<Button to={`/places/${props.id}`}>EDIT</Button>)}
                        {auth.userId === props.creator && (<Button danger onClick={showDeleteWarningHandler}>DELETE</Button>)}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

export default PlaceItem;