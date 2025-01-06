import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatchCart, useCart } from "./ContextReducer";

export default function Card(props) {
  const navigate = useNavigate();
  const dispatch = useDispatchCart();
  const data = useCart();

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const priceRef = useRef();

  // Extract options and foodItem from props
  const options = props.options || {};
  const priceOptions = Object.keys(options);
  const foodItem = props.item || {};
  const foodName = foodItem.name || "Food Item";

  const handleClick = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  };

  const handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleOptions = (e) => {
    setSize(e.target.value);
  };

  const handleAddToCart = async () => {
    const finalPrice = qty * parseInt(options[size], 10);

    // Check if the item with the same id and size exists in the cart
    const existingItem = data.find(
      (item) => item.id === foodItem._id && item.size === size
    );

    if (existingItem) {
      // If the item exists, update its quantity and price
      await dispatch({
        type: "UPDATE",
        id: foodItem._id,
        price: finalPrice,
        qty: existingItem.qty + qty, // Increment quantity
        size: size,
      });
    } else {
      // Add a new item to the cart
      await dispatch({
        type: "ADD",
        id: foodItem._id,
        name: foodName,
        price: finalPrice,
        qty,
        size,
        //img: props.ImgSrc,
        img: props.ImgSrc,
      });
    }

    // Log the current cart for debugging
    console.log("Current Cart:", data);
  };

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  const finalPrice = qty * parseInt(options[size] || 0, 10);

  return (
    <div>
      <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
        <img
          src={props.ImgSrc || "./food.jpg"} // Fallback image
          className="card-img-top"
          alt={foodName}
          style={{ height: "120px", objectFit: "fill" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150"; // Fallback if image fails to load
            e.target.alt = "Placeholder Image";
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{foodName}</h5>
          <div className="container w-100 p-0" style={{ height: "38px" }}>
            {/* Quantity Selector */}
            <select
              className="m-2 h-100 w-20 bg-success text-black rounded"
              onChange={handleQty}
              value={qty}
            >
              {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {/* Size Selector */}
            <select
              className="m-2 h-100 w-20 bg-success text-black rounded"
              ref={priceRef}
              onChange={handleOptions}
              value={size}
            >
              {priceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="d-inline ms-2 h-100 w-20 fs-5">
            ৳ {finalPrice}/-
            </div>
          </div>
          <hr />
          <button
            className="btn btn-success justify-center ms-2"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
