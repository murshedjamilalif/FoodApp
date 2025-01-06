import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from './ContextReducer'; // Assuming you have a custom context for cart
import Modal from '../Modal';
import Cart from '../screens/Cart';

export const Navbar = () => {
    const [cartView, setCartView] = useState(false);
    let navigate = useNavigate();
    const items = useCart(); // Fetch cart items using the context

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/login");
    };

    const loadCart = () => {
        setCartView(true);
    };

    return (
        <div>
            <nav
                className="navbar navbar-expand-lg navbar-dark bg-success position-sticky"
                style={{
                    boxShadow: "0px 10px 20px black",
                    position: "fixed",
                    zIndex: "10",
                    width: "100%",
                }}
            >
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fst-italic" to="/">Food App</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link
                                    className="nav-link fs-5 mx-3 active"
                                    aria-current="page"
                                    to="/"
                                >
                                    Home
                                </Link>
                            </li>
                            {localStorage.getItem("token") && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link fs-5 mx-3 active"
                                        aria-current="page"
                                        to="/myorder"
                                    >
                                        My Orders
                                    </Link>
                                </li>
                            )}
                        </ul>
                        {!localStorage.getItem("token") ? (
                            <div className="d-flex">
                                <Link className="btn bg-white text-success mx-1" to="/login">
                                    Login
                                </Link>
                                <Link className="btn bg-white text-success mx-1" to="/signup">
                                    Signup
                                </Link>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn bg-white text-success mx-2"
                                    onClick={loadCart}
                                >
                                    Cart ({items.length})
                                </button>
                                {cartView && (
                                    <Modal onClose={() => setCartView(false)}>
                                        <Cart />
                                    </Modal>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="btn bg-white text-success mx-2"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
