import React,{useState,useEffect} from 'react'
import firebase from 'firebase'
import M from 'materialize-css'
import firestorage from '../firebase'
import {useHistory} from 'react-router-dom'

const CreatePost = () => {
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    url
                })
            }).then(res=>res.json()).catch(Error=>{console.log(Error)})
            .then(data=>{
                console.log(url)
                if(data.error)
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                else{
                    M.toast({html:"photo successfully uploaded",classes:"#43a047 green darken-1"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url])
    const postDetails = () =>
    {
        var storageRef = firebase.storage().ref();
        var imagesref = storageRef.child('images/'+ title);
        var uploadTask = imagesref.put(image);
        uploadTask.on('state_changed', function(snapshot){
          }, function(error) {
            M.toast({html: error,classes:"#c62828 red darken-3"})
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadurl) {
              console.log('File available at', downloadurl);
              setUrl(downloadurl)
             
            });
          });

         

    }
    return (
        <div className="card input-field"
        style={{
            margin:"50px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            <input type="text" placeholder="title" 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />
            <input type="text" placeholder="body" 
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                    <span>upload Image</span>
                    <input type="file"
                        //value={image}
                        onChange={(e)=>setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                onClick={()=>postDetails()}
            >
                    Submit Post
            </button>
        </div>
    )
}

export default CreatePost