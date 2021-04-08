import React, {useEffect} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Page from './components/Page';
import Room from './pages/Room';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import PreLoading from './components/PreLoading';
import ErrorService from "./service/errorService";
import './styles/base.scss';
import SocketService from "./service/socketService";
import PersonalArea from "./pages/PersonalArea";
import {connect, useDispatch} from "react-redux";
import {fetchGetUser} from "./store/actions/fetchActions";
import {StoreTypes} from "./store/store.types";

const errorService = new ErrorService();
const socketService = new SocketService();

interface AppPropsTypes {
  userIsLoaded: boolean;
}

function App(props: AppPropsTypes) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGetUser());
  }, []);

  return (
    <PreLoading loadingIsComplete={props.userIsLoaded}>
      <BrowserRouter>
        <Page>
          <Switch>
            <Route exact path="/">
              <Main socketService={socketService}/>
            </Route>
            <Route path="/NotFound">
              <NotFound/>
            </Route>
            <Route path="/room/:roomId">
              <Room socketService={socketService}/>
            </Route>
            <Route path="/users/:userId/rooms">
              <PersonalArea/>
            </Route>
            <Route>
              <NotFound/>
            </Route>
          </Switch>
        </Page>
      </BrowserRouter>
    </PreLoading>
  );
}

const mapStateToProps = (store: StoreTypes) => {
  return {
    userIsLoaded: store.user.isLoaded
  }
}

export default connect(mapStateToProps)(App);