import  React, { useState, useContext } from 'react';
import {AuthContext} from '../contexts/AuthContext';
import axios from 'axios';

const Login =  (props) => {
    //Invoke authentication context using useContext hook
    const { updateAuth } = useContext(AuthContext);

    //initiate state values
    const initialState = {username: '',password: ''};

    //Create a new state
    const [user, setUser] = useState(initialState);

    //Create Error state
    const [errorMessage, setErrorMessage] = useState('');

    //Hundle inputs changes
    const onChange = (e) =>{
        setUser({
            ...user,
            [e.target.name] : e.target.value
        });
    }

    //handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //Call api endpoint
        try{
            const res = await axios.post('http://localhost:5000/api/users/login', user,{ withCredentials: true });

            //Check if user account is disabled,if yes, redirect him to change his password
            if(res.data.state === 'disabled'){
                props.history.push('/updatepassword/' + res.data.userId);
                return;
            }

            //update auth context
            updateAuth(res.data);
            
            //Redirect the user depending on his type
            if (res.data.type === 'user'){
                props.history.push('/newticket');
            } else if (res.data.type === 'admin'){
                props.history.push('/users');
            } else if (res.data.type === 'tech'){
                props.history.push('/listtickets');
            }   
        }catch(err){
            //Set error message
            setErrorMessage(err.response.data.message);
        }
    }

    return <div>



<form id="login" name="login" onSubmit={handleSubmit}>
  <div class="form-group">
    <label>Username</label>
    <input id="username" name="username" placeholder="Username" className="form-control" type="text" onChange={onChange} />
  </div>

  <div class="form-group">
    <label>Password</label>
    <input id="password" name="password" placeholder="Password" className="form-control" type="password" onChange={onChange}  />
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

    </div>
}

export default Login;