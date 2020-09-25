import React,{useEffect,useState,useContext} from 'react';
import {userContext} from '../../App'

const Profile = ()=>{
    const [mypics,setPics] = useState([])
    const { state, dispatch } = useContext(userContext)
    useEffect(()=>{
        let unmounted = true
        fetch('/myposts',{
            headers:{
                "Authorization":localStorage.getItem("jwt")
            }
        }).then(res=>{
            if(unmounted){
            res.json()
        .then(result=>{
            setPics(result.myposts)
        })
    }
    })
    return () => unmounted = false
    },[])
    return(
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
                    <h4>{state?state.name:"loading"}</h4>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"109%"
                    }}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.followings.length:"0"} followings</h6>
                    </div>

                </div>
            </div>
            
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return([<img key={item._id} className="item" src={item.photo} alt={item.title}/>])
                    })
                }
            </div>
        
        </div>
    )
}

export default Profile