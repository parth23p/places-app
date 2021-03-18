import React from 'react';
import './PlaceList.css';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button.js';

const PlaceList = (props) => {
    if (props.items.length === 0) {
        return (<div className="place-list center">
            <Card>
                <Link>
                    <h2>No Places Found! May be create one?</h2>
                    <Button to="/places/new">Share Palce</Button>
                </Link>
            </Card>
        </div>);
    }
    return (
        <ul className="place-list">
            {props.items.map(place => <PlaceItem key={place.id}
                id={place.id}
                image={place.image}
                title={place.title}
                description={place.description}
                address={place.address}
                creator={place.creator}
                coordinates={place.location}
                onDelete={props.onDeletePlace}
            />

            )}
        </ul>
    )
};

export default PlaceList;

