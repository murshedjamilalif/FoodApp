import React from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { FaTrash } from 'react-icons/fa'; // Assuming you're using react-icons for the delete icon

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  // Check if cart is empty
  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    );
  }

  // Handle Checkout action
  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let response = await fetch("http://localhost:5000/api/auth/orderData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString()
      })
    });

    if (response.status === 200) {
      dispatch({ type: "DROP" });
    }
  };

  // Calculate total price
  let totalPrice = data.reduce((total, food) => {
    // Check if price exists and is a valid number
    if (food.price && !isNaN(Number(food.price))) {
      return total + Number(food.price);
    }
    return total;
  }, 0);

  console.log('Total Price:', totalPrice);  // Debugging the total price

  return (
    <div>
      <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md'>
        <table className='table table-hover'>
          <thead className='text-success fs-4'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td>
                  <button 
                    type="button" 
                    className="btn btn-danger p-0" 
                    onClick={() => dispatch({ type: "REMOVE", index: index })}
                  >
                    <FaTrash /> {/* Bootstrap trash icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Ensure total price is rendered correctly */}
        <div>
  <h1 className='fs-2 total-price'>
    Total Price: {totalPrice.toFixed(2)} /-
  </h1>
</div>



        {/* Checkout Button */}
        <div>
          <button className='btn bg-success mt-5' onClick={handleCheckOut}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
