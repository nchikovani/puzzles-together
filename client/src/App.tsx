import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Page from './components/Page';
import Room from './pages/Room';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import ErrorService from "./service/errorService";
import './styles/base.scss';
import SocketService from "./service/socketService";


const errorService = new ErrorService();
const socketService = new SocketService();

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
          <Route>
            <NotFound/>
          </Route>
        </Switch>
      </Page>
    </BrowserRouter>
  );
}

export default App;