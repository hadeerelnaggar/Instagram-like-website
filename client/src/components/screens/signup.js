import React, {useState} from 'react';
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = ()=>
{
    const history = useHistory()
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [confirmpassword,setConfirm] = useState("");
    const postData = ()=>{
        if(!name || !email || !password){
            M.toast({html: "please enter all fields",classes:"#c62828 red darken-3"})
            return
        }
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid Email Address",classes:"#c62828 red darken-3"})
            return
        }
        if(password.length<6){
            M.toast({html: "password must be minimum of 6 characters",classes:"#c62828 red darken-3"})
            return
        }
        if(password !== confirmpassword){
            M.toast({html: "passwords doesn't match",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
            }
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Intagram</h2>
                <h6>Sign up to see photos and videos from your friends.</h6>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="confirm password"
                    value={confirmpassword}
                    onChange={(e)=>setConfirm(e.target.value)}
                />
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
                    onClick={()=>postData()}
                >
                    Signup
                </button>
                <h6>Have an account?<Link to="/login">Log in</Link></h6>
            </div>
        </div>
    )
}

export default Signup