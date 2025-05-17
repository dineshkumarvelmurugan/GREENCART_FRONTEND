import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const carouselImages = [
    "https://t3.ftcdn.net/jpg/04/36/00/20/360_F_436002013_xpV04ylL6uUOcNeGsPzBIQEIRkIFQlQD.jpg",
    "https://t4.ftcdn.net/jpg/01/57/31/97/360_F_157319789_5xOotZuP9kU74MKEeZQnGHG59gERM84H.jpg",
    "https://media.istockphoto.com/id/1752175714/photo/plants-in-a-flower-nursery-garden-center.jpg?s=612x612&w=0&k=20&c=hX9jSKTPjOStiiL6jjO1mNUakr06CDqUwKfNPSZWj8o=",
    "https://media.istockphoto.com/id/1396749610/photo/pots-of-colorful-petunias-in-planters-in-a-garden-center.jpg?s=612x612&w=0&k=20&c=2mOf_bnjWRb4-D8N5JMsKOSARYOgewpuRcbeUjVtsZ0=",
    "https://t4.ftcdn.net/jpg/09/00/17/75/360_F_900177564_TkmPohftDBFVMHeEadXHXHYJ6K9onraX.jpg",
    "https://www.shutterstock.com/image-photo/on-rainy-day-garden-nursery-260nw-2415197075.jpg"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
  
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
  
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50); 
      }, 500); 
    }, 1500); 
  
    return () => clearInterval(interval);
  }, [carouselImages.length]);
  
  

  const navigateToPlants = () => {
    navigate('/plants');
  };

  const getDisplayImages = () => {
    const lastIndex = carouselImages.length - 1;
    
    return [
      carouselImages[lastIndex], 
      ...carouselImages,         
      carouselImages[0]         
    ];
  };
  
  const displayImages = getDisplayImages();
  
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-carousel">
          <div 
            className={`carousel-inner ${isTransitioning ? 'transitioning' : ''}`} 
            style={{ 
              transform: `translateX(-${(currentImageIndex + 1) * 100}%)` 
            }}
          >
            {displayImages.map((image, index) => (
              <div key={index} className="carousel-item">
                <img src={image} alt={`Nursery Image ${index}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="hero-content">
          <h1>🌿 Welcome to Sri Vaari Nursery Garden 🌿</h1>
          <p className="tagline">Your Green Paradise Starts Here</p>
          <button className="cta-button" onClick={navigateToPlants}>Explore Our Collection</button>
        </div>
      </section>

      <section className="explore-section">
        <div className="section-header">
          <h2>🌿 Explore Our Collection</h2>
          <div className="underline"></div>
        </div>
        <div className="explore-container">
          <img 
            src="https://img.freepik.com/premium-photo/web-page-mockup-plant-nursery-ecommerce-website-with-live-preview-product-images_1310094-130633.jpg" 
            alt="Sri Vaari Nursery Collection" 
            className="explore-image"
          />
          <button className="explore-button" onClick={navigateToPlants}>View All Plants</button>
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2>🌱 About Us</h2>
          <div className="underline"></div>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>
              At Sri Vaari Nursery Garden, we believe that plants bring life, beauty, and calm to any space.
              We specialize in providing a wide range of healthy, vibrant plants—from flowering beauties to air-purifying wonders and garden essentials—all delivered right to your doorstep.
            </p>
            <p>
              Whether you're a beginner plant lover or a seasoned gardener, we have something perfect for you!
            </p>
          </div>
        </div>
      </section>

      <section className="offer-section">
        <div className="section-header">
          <h2>🌼 What We Offer</h2>
          <div className="underline"></div>
        </div>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="card-icon">🌿</div>
            <h3>Indoor & Outdoor Plants</h3>
            <p>Add a touch of green to your home, office, or garden with our carefully selected collection.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🌸</div>
            <h3>Flowering Plants</h3>
            <p>Brighten up your space with color and fragrance from our beautiful blooming varieties.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🪴</div>
            <h3>Medicinal & Herbal Plants</h3>
            <p>Grow your own wellness with our selection of beneficial medicinal and herbal plants.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon">🌱</div>
            <h3>Organic Fertilizers</h3>
            <p>Keep your plants happy and healthy with our premium organic fertilizers and soil mixes.</p>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="section-header">
          <h2>🚚 Why Choose Us?</h2>
          <div className="underline"></div>
        </div>
        <div className="benefits-container">
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Wide Selection of Healthy Plants</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Secure Online Ordering</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Quick Home Delivery</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Expert Gardening Tips</div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <div className="benefit-text">Great Deals & Offers</div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>🌿 Featured Categories</h2>
          <div className="underline"></div>
        </div>
        <div className="category-tabs">
          <div className="category-tab">✨ Bestsellers</div>
          <div className="category-tab">🪴 New Arrivals</div>
          <div className="category-tab">💧 Low Maintenance</div>
          <div className="category-tab">🌞 Outdoor Favorites</div>
        </div>
      </section>

      <section className="shop-now">
        <div className="shop-content">
          <h2>📦 Shop Now & Bring Nature Home</h2>
          <p>Browse our collection and order your favorite plants today!</p>
          <p className="grow-text">Let's grow together. 🌱</p>
          <button className="shop-button" onClick={navigateToPlants}>Shop Collection</button>
        </div>
      </section>
    </div>
  );
};

export default Home;