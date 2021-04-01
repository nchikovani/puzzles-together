import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Page from './components/Page';
import Room from './pages/Room';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import ErrorService from "./service/errorService";
import './styles/base.scss';
import SocketService from "./service/socketService";
import UserService from "./service/userService";
import UserRooms from "./pages/UserRooms";


const errorService = new ErrorService();
const socketService = new SocketService();
const userService = new UserService();

function App() {

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
          <Route path="/Room/:roomId">
            <Room socketService={socketService}/>
          </Route>
          <Route path="/Rooms">
            <UserRooms userService={userService}/>
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