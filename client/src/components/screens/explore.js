import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../App'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'


const Followingsposts = () => {
    const { state, dispatch } = useContext(userContext)
    const history = useHistory()
    const [data, setData] = useState([])
    useEffect(() => {
        let unmounted = true
        console.log(state)
        fetch('/allposts', {
            headers: {
                "Authorization": localStorage.getItem("jwt")
            }
        }).then(res => {
            if(unmounted){
                res.json()
            .then(result => {
                console.log(result)
                setData(result.posts)
            })}
        })
        return () => unmounted = false
    }, [])

    const likepost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log("liked")
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
    }

    const unlikepost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
    }
    const makecomment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletepost = (postId) => {
        fetch('/deletepost/' + postId, {
            method: "delete",
            headers: {
                "Authorization": localStorage.getItem("jwt")
            },
        }).then(res => res.json())
            .then(result => {
                M.toast({ html: result.message, classes: "#43a047 green darken-1" })
                const newdata = data.filter(item => {
                    return item._id !== result.result._id
                })
                setData(newdata)
            })
    }
    const deletecomment = (commentId, postId) => {
        fetch('/deletecomment', {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                commentId
            })
        }).then(res => res.json())
            .then(result => {
                M.toast({ html: result.message, classes: "#43a047 green darken-1" })
                const newData = data.map(item => {
                    if (item._id === postId) {
                        return result.data
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ padding: "10px", fontWeight: "500" }}
                                onClick={() => {
                                    item.postedby._id === state._id
                                        ?
                                        history.push('/profile')
                                        :
                                        history.push('/profile/' + item.postedby._id)

                                }}
                            >{item.postedby.name}
                                {
                                    item.postedby._id === state._id
                                        ?
                                        <i className="material-icons" style={{
                                            float: "right"
                                        }} onClick={() => { deletepost(item._id) }}>
                                            delete
                                    </i>
                                        :
                                        <div></div>
                                }
                            </h5>

                            <div className="card-image">
                                {item.likes.includes(state._id)
                                    ?
                                    <img src={item.photo} onDoubleClick={() => { unlikepost(item._id) }} />
                                    :
                                    <img src={item.photo} onDoubleClick={() => { likepost(item._id) }} />
                                }

                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons" style={{ color: "red" }} onClick={() => { unlikepost(item._id) }}>
                                        favorite
                                </i>
                                    :
                                    <i className="material-icons" onClick={() => { likepost(item._id) }}>
                                        favorite_border
                                </i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h5>{item.title}</h5>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }} onClick={() => {
                                                record.postedby._id === state._id
                                                    ?
                                                    history.push('/profile')
                                                    :
                                                    history.push('/profile/' + record.postedby._id)
                                            }}>{record.postedby.name}</span> {record.text}
                                                {
                                                    record.postedby._id === state._id
                                                        ?
                                                        <i className="material-icons" style={{
                                                            float: "right", color: "#bdbdbd"
                                                        }} onClick={() => { deletecomment(record._id, item._id) }}>
                                                            delete
                                                        </i>
                                                        :
                                                        <div></div>
                                                }
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makecomment(e.target[0].value, item._id)
                                    e.target[0].value = ""
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Followingsposts