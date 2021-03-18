import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
const Users = () => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users'
                );
                //   for fetch default request type is a GET requet
                // const responseData = await response.json();

                // if (!response.ok) {
                //     throw new Error(responseData.message);
                // }
                setLoadedUsers(responseData.users);
                // setIsLoading(false);
            } catch (err) {

                // setError(err.message);
            }
        };
        fetchUsers();
    }, [sendRequest]);
    // setIsLoading(false);

    //     sendRequest();
    //     console.log(loadedUsers);


    // const errorHandler = () => {

    // }
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className="center">
                <LoadingSpinner />
            </div>}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>

    );

};
export default Users;