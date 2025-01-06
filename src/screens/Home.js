import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:5000/api/auth/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      // Validate the data structure
      if (!Array.isArray(data) || data.length !== 2) {
        throw new Error('Invalid data format received');
      }

      const [items, categories] = data;

      if (!Array.isArray(items)) {
        throw new Error('Food items must be an array');
      }

      if (!Array.isArray(categories)) {
        throw new Error('Categories must be an array');
      }

      setFoodItems(items);
      setFoodCat(categories);
    } catch (err) {
      console.error('Error loading food data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-2">Loading food items...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            Error loading food data: {error}
            <button 
              className="btn btn-primary ms-3"
              onClick={() => loadFoodItems()}
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {/* Carousel Section */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner" id="carousel">
          <div className="carousel-caption" style={{ zIndex: '9' }}>
            <div className="d-flex justify-content-center">
              <input
                className="form-control me-2 w-75 bg-white text-dark"
                type="search"
                placeholder="Search in here..."
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                className="btn text-white bg-danger"
                onClick={() => setSearch('')}
              >
                X
              </button>
            </div>
          </div>
          <div className="carousel-item active">
            <img src="./burger.jpg" className="d-block w-100" style={{ filter: 'brightness(30%)' }} alt="Burger" />
          </div>
          <div className="carousel-item">
            <img src="./food.jpg" className="d-block w-100" style={{ filter: 'brightness(30%)' }} alt="Pastry" />
          </div>
          <div className="carousel-item">
            <img src="./hamburger.png" className="d-block w-100" style={{ filter: 'brightness(30%)' }} alt="Barbeque" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Food Categories and Items Section */}
      <div className='container'>
        {foodCat.length > 0 ? (
          foodCat.map((data) => (
            <div key={data._id || data.id} className='row mb-3'>
              <div className='fs-3 m-3'>{data.CategoryName}</div>
              <hr 
                className="my-3"
                style={{ 
                  height: '4px',
                  backgroundImage: '-webkit-linear-gradient(left, rgb(0, 255, 137), rgb(0, 0, 0))'
                }}
              />
              {foodItems
                .filter(item => 
                  item.CategoryName === data.CategoryName && 
                  item.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(filteredItem => (
                  <div key={filteredItem._id || filteredItem.id} className='col-12 col-md-6 col-lg-3'>
                    <Card 
                      //foodName={filteredItem.name}
                      foodName={filteredItem}
                      item={filteredItem}
                      options={filteredItem.options?.[0] || {}}
                      //ImgSrc={filteredItem.img}
                    />
                  </div>
                ))}
            </div>
          ))
        ) : (
          <div className="container mt-5 text-center">
            <h3>No Categories Found</h3>
            <p>Please try refreshing the page or check back later.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}