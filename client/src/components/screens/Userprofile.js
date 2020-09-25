import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../../App'
import { useParams } from 'react-router-dom'
import { database } from 'firebase';

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const [showfollow, setshowfollow] = useState(true)
    const { state, dispatch } = useContext(userContext)
    const { userid } = useParams()
    useEffect(() => {
        fetch('/user/' + userid, {
            method: "GET",
            headers: {
                "Authorization": localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setUserProfile(result)
            })
    }, [])

    const followUser = (userId) => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res => res.json())
            .then(result => {
                console.log(state._id)
                dispatch({ type: "UPDATE", payload: { followings: result.result.followings, followers: result.result.followers }})
                localStorage.setItem("user", JSON.stringify(result.result))
                setUserProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, result.result._id]
                        }
                    }
                })
                setshowfollow(false)
            }).catch(err => {
                console.log(err)
            })
    }

    const unfollowUser = (userId) => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res => res.json())
            .then(result => {
                console.log(state._id)
                dispatch({ type: "UPDATE", payload: { followings: result.data.followings, followers: result.data.followers } })
                localStorage.setItem("user", JSON.stringify(result.data))
                console.log(result)
                setUserProfile((prevState) => {
                    const newFollowers = prevState.user.followers.filter(item => item != result.data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollowers
                        }
                    }
                })
                setshowfollow(true)
            }).catch(err => {
                console.log(err)
            })
    }
    
    return (
        <>
            {
                userProfile ?
                    <div style={{ maxWidth: "600px", margin: "0px auto" }}>
                        <div style={{

                            display: "flex",
                            justifyContent: "space-around",
                            margin: "18px 0px",
                            borderBottom: "1px solid grey",
                        }}>
                            <div>
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                            </div>
                            <div>
                                <h4>{userProfile.user.name}</h4>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "109%"
                                }}>
                                    <h6>{userProfile.posts.length} posts</h6>
                                    <h6>{userProfile.user.followers.length} followers</h6>
                                    <h6>{userProfile.user.followings.length} followings</h6>
                                </div>
                                {
                                    userProfile.user.followers.includes(state._id)
                                        ?
                                        <button style={{ margin: "10px" }} className="btn waves-effect waves-light #42a5f5 blue darken-1"
                                            onClick={() => unfollowUser(userProfile.user._id)}
                                        >
                                            Unfollow
                                        </button>
                                        :
                                        <button style={{ margin: "10px" }} className="btn waves-effect waves-light #42a5f5 blue darken-1"
                                            onClick={() => followUser(userProfile.user._id)}
                                        >
                                            Follow
                                        </button>

                                }

                            </div>
                        </div>

                        <div className="gallery">
                            {
                                userProfile.posts.map(item => {
                                    return ([<img key={item._id} className="item" src={item.photo} alt={item.title} />])
                                })
                            }
                        </div>

                    </div>
                    : <h2>loading....!</h2>
            }

        </>
    )
}

export default Profile