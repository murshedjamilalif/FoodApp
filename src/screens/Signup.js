import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar';

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" })
  const [address, setAddress] = useState("");
  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let navLocation = () => {
        return new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
      };
      let latlong = await navLocation();
      let [lat, long] = [latlong.coords.latitude, latlong.coords.longitude];
      console.log(lat, long);
      const response = await fetch("http://localhost:5000/api/auth/getlocation", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latlong: { lat, long } })
      });
      const { location } = await response.json();
      console.log(location);
      setAddress(location);
      setCredentials({ ...credentials, geolocation: location });
    } catch (error) {
      console.error("Geolocation error:", error);
      alert("Failed to get location. Please enable location services.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation || address
      })
    });

    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem('token', json.authToken);
      navigate("/login");
    } else {
      alert("Enter valid credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover', height: '100vh' }}>
      <Navbar />
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="name" className="form-label" style={{ color: 'white' }}>Name</label>
            <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} />
          </div>
          <div className="m-3">
            <label htmlFor="email" className="form-label" style={{ color: 'white' }}>Email address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} />
          </div>
          <div className="m-3">
            <label htmlFor="address" className="form-label" style={{ color: 'white' }}>Address</label>
            <input type="text" className="form-control" name='geolocation' placeholder="Click below for fetching address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="m-3">
            <button type="button" onClick={handleClick} className="btn btn-success">Click for current Location</button>
          </div>
          <div className="m-3">
            <label htmlFor="password" className="form-label" style={{ color: 'white' }}>Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' />
          </div>
          <button type="submit" className="m-3 btn btn-success">Submit</button>
          <Link to="/login" className="m-3 mx-1 btn btn-danger">Already a user</Link>
        </form>
      </div>
    </div>
  );
}
