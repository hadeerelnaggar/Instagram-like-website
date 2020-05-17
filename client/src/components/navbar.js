import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {userContext} from '../App'
const NavBar = ()=>{
  const {state,dispatch} = useContext(userContext)
  const history = useHistory()
      const renderList = ()=>{
      if(state){
        return[
          <li><Link to="/profile">Profile</Link>to</li>,
          <li><Link to="/create">Create Post</Link>to</li>,
          <li>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                    onClick={()=>{
                      localStorage.clear()
                      dispatch({type:"CLEAR"})
                      history.push('/login')
                    }}
                >
                    Logout
                </button>
          </li>
        ]
      }else{
          return[
            <li><Link to="/login">Login</Link>to</li>,
            <li><Link to="/signup">Signup</Link>to</li>
          ]
      }
    }
    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>to
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default NavBar