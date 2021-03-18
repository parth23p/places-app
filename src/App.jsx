import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlaces.js';
// import UserPlaces from './places/pages/UserPlaces.js';
// import UpdatePlace from './places/pages/UpdatePlace.js';
// import Auth from './user/pages/Auth.js';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context.js';
import { useAuth } from './shared/hooks/auth-hook';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlaces'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces.js'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace.js'));
const Auth = React.lazy(() => import('./user/pages/Auth.js'));


const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { token, login, logout, userId } = useAuth();
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token: token,
        login: login,
        logout: logout
      }}>
      <Router>
        <MainNavigation />
        <main>
          {/* <Switch> */}
          {/* <Route path="/" exact>
              <Users />
            </Route>
            <Route path="/:userId/places" exact>
              <UserPlaces />
            </Route>
            <Route path="/places/new" exact>
              <NewPlace />
            </Route>
            <Route path="/places/:placeId" exact>
              <UpdatePlace />
            </Route>
            <Route path="/auth" exact>
              <Auth />
            </Route>
            <Redirect to="/" /> */}
          <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>{routes}</Suspense>
          {/* </Switch> */}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
