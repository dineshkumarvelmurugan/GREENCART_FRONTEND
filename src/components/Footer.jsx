import './Footer.css'; // optional: your custom CSS

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="contact-info fade-in">
          <p>📍 Address: Masakalipatti, Namakkal, Tamil Nadu</p>
          <p>📞 Phone: +91 94435 11253</p>
          <p>✉️ Email: srivaaripm@gmail.com</p>
          <p>📸 Instagram: 
            <a 
              href="https://www.instagram.com/sri_vaari_nursery_garden?igsh=MWtxNnJpaDJiZnV1MQ==://www.instagram.com/your_instagram_handle" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              sri_vaari_nursery_garden
            </a>
          </p>
        </div>


        <div className="business-hours fade-in">
          <h4>Business Hours</h4>
          <p>🕒 Monday - Saturday: 9 AM - 7 PM</p>
          <p>🕒 Sunday: Closed</p>
        </div>

        <div className="quick-links fade-in">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/plants">Plants</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <p className="footer-note fade-in">© 2025 Sri Vaari Nursery. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
