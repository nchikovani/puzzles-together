import React, {useEffect} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Page from './components/Page';
import Room from './pages/Room';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import ErrorService from "./service/errorService";
import './styles/base.scss';
import SocketService from "./service/socketService";
import PersonalArea from "./pages/PersonalArea";
import {useDispatch} from "react-redux";
import {fetchGetUser} from "./store/actions/fetchActions";

const errorService = new ErrorService();
const socketService = new SocketService();

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGetUser());
  }, []);

  return (
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
  );
}

export default App;