import React, {useEffect} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Page from './components/Page';
import Room from './pages/Room';
import Main from './pages/Main';
import Error from './pages/Error';
import PreLoading from './components/PreLoading';
import ErrorService from "./service/errorService";
import './styles/base.scss';
import SocketService from "./service/socketService";
import PersonalArea from "./pages/PersonalArea";
import {connect, useDispatch} from "react-redux";
import {fetchGetUser} from "./store/actions/fetchActions";
import {StoreTypes, ErrorStateTypes} from "./store/store.types";
import ErrorWindow from './components/ErrorWindow';

const errorService = new ErrorService();
const socketService = new SocketService();

interface AppPropsTypes {
  userIsLoaded: boolean;
  error: ErrorStateTypes;
}

function App(props: AppPropsTypes) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGetUser());
  }, []);

  return (
    <PreLoading loadingIsComplete={props.userIsLoaded}>
      <BrowserRouter>
        {
          props.error.isError && props.error.showType === 'page'
          ? <Error message={props.error.message} statusCode={props.error.statusCode}/>
          : <Switch>
            <Route exact path="/">
              <Page>
                <Main socketService={socketService}/>
              </Page>
            </Route>
            <Route path="/room/:roomId">
              <Page>
                <Room socketService={socketService}/>
              </Page>
            </Route>
            <Route path="/users/:userId/rooms">
              <Page>
                <PersonalArea/>
              </Page>
            </Route>
            <Route>
              <Error message={'Page not found.'} statusCode={404}/>
            </Route>
          </Switch>
        }
      </BrowserRouter>
      <ErrorWindow error={props.error}/>
    </PreLoading>
  );
}

const mapStateToProps = (store: StoreTypes) => {
  return {
    userIsLoaded: store.user.isLoaded,
    error: store.error
  }
}

export default connect(mapStateToProps)(App);