import React,{useEffect,useState,useContext} from 'react';
import {userContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = ()=>{
    const [userProfile,setUserProfile] = useState(null)
    const {state,dispatch} = useContext(userContext)
    const {userid} = useParams()
    useEffect(()=>{
        fetch('/user/' + userid ,{
            method:"GET",
            headers:{
                "Authorization":localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setUserProfile(result)
        })
    },[])
    return(
        <>
        {
            userProfile? 
            <div style={{maxWidth:"600px",margin:"0px auto"}}>
            <div style={{

                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey",
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"109%"
                    }}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>120 followers</h6>
                        <h6>550 followings</h6>
                    </div>

                </div>
            </div>
            
            <div className="gallery">
                {
                    userProfile.posts.map(item=>{
                        return([<img key={item._id} className="item" src={item.photo} alt={item.title}/>])
                    })
                }
            </div>
        
        </div>
            :<h2>loading....!</h2>
        }
        
        </>
    )
}

export default Profile