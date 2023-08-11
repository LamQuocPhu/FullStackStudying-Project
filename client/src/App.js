import './App.css';
import { useState } from "react";
import Axios from "axios";

function App() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(0);
  const [retypepassword, setRetypepassword] = useState(0);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(0);

  const addMember = () => {
    Axios.post('http://localhost:3001/addMember', {
      username: username,
      password: password,
      phone: phone,
      email: email,
      address: address
    }).then(() => {
      console.log("AddMember success");
    });

  }

  return (
    <div className="App">
      <h1 className='addMember'>Register Page</h1>
      <div className='addMember'>
        <label>Username: </label>
        <input type="text" onChange={(event) => {
          setUsername(event.target.value);
        }}></input>
        <label>Email: </label>
        <input type="text" onChange={(event) => {
          setEmail(event.target.value);
        }}></input>
        <label>Password: </label>
        <input type="password" onChange={(event) => {
          setPassword(event.target.value);
        }}></input> 
        <label>Retype Password: </label>
        <input type="password" onChange={(event) => {
          setRetypepassword(event.target.value);
        }}></input> 
        <label>Address: </label>
        <input type="text" onChange={(event) => {
          setAddress(event.target.value);
        }}></input>
        <label>Phone: </label>
        <input type="number" onChange={(event) => {
          setPhone(event.target.value);
        }}></input>
        <button onClick={addMember}>Register</button>
      </div>
    </div>
  );
}

export default App;
