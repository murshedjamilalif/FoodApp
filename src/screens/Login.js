import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const validateForm = () => {
    if (!credentials.email || !credentials.password) {
      setError("Please fill in all fields");
      return false;
    }
    if (!credentials.email.includes('@')) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('token', json.authToken);
        navigate("/");
      } else {
        setError(json.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setError(""); // Clear error when user starts typing
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div 
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div>
        <Navbar />
      </div>
      
      <div className='container'>
        <form 
          className='w-50 m-auto mt-5 border bg-dark border-success rounded p-3'
          onSubmit={handleSubmit}
        >
          <h2 className="text-center mb-4 text-white">Login</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
            <div className="form-text text-muted">
              We'll never share your email with anyone.
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span 
                    className="spinner-border spinner-border-sm me-2" 
                    role="status" 
                    aria-hidden="true">
                  </span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
            <Link to="/signup" className="btn btn-danger">
              New User? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}