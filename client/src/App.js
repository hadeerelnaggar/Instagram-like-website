import React, { useEffect, createContext,useReducer,useContext} from 'react';
import NavBar from './components/navbar'
import Home from './components/screens/home'
import Login from './components/screens/login'
import Signup from './components/screens/signup'
import Profile from './components/screens/profile'
import CreatePost from './components/screens/createpost'
import UserProfile from './components/screens/Userprofile'
import './App.css'
import {BrowserRouter, Route, Switch,useHistory} from 'react-router-dom'
import {reducer,initialState} from './reducers/userReducer'

export const userContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(userContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      history.push('/login')
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
    </Switch>
    )
}
function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <userContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing/>
      </BrowserRouter>
    </userContext.Provider>

  );
}

export default App;
