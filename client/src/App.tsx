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
import Rooms from "./pages/Rooms";
import {connect, useDispatch} from "react-redux";
import {fetchGetUser} from "./store/actions/fetchActions";
import {IStore, IErrorState} from "./store/store.types";
import ErrorWindow from './components/ErrorWindow';

new ErrorService();
const socketService = new SocketService();

interface IAppProps {
  userIsLoaded: boolean;
  error: IErrorState;
}

const App: React.FC<IAppProps> = ({userIsLoaded, error}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGetUser());
  }, []);

  return (
    <PreLoading loadingIsComplete={userIsLoaded}>
      <BrowserRouter>
        <Switch>
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
              <Rooms/>
            </Page>
          </Route>
          <Route>
            <Error message={'Page not found.'} statusCode={404}/>
          </Route>
        </Switch>
      </BrowserRouter>
      <ErrorWindow error={error}/>
    </PreLoading>
  );
}

const mapStateToProps = (store: IStore) => {
  return {
    userIsLoaded: store.user.isLoaded,
    error: store.error
  }
}

export default connect(mapStateToProps)(App);