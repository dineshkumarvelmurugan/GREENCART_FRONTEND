import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import payment from "../assets/QR.jpg";
import QRModal from "./QRModal";
import jsPDF from "jspdf";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = location.state || {};

  const [formData, setFormData] = useState({
    orderId: "",
    username: "",
    phone: "",
    address: "",
    plantName: "",
    quantity: 0,
    totalAmount: totalAmount,
    orderDate: "",
    paymentMethod: "COD",
    paymentId: "",
  });

  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPdfConfirmation, setShowPdfConfirmation] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !cartItems || cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      username: user.username,
      phone: user.mobile,
      address: user.address,
      plantName: cartItems.map((item) => item.plant.name).join(", "),
      quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount,
    }));

    axios.get("http://localhost:5000/api/orders/next-id").then((res) => {
      setFormData((prev) => ({ ...prev, orderId: res.data.nextOrderId }));
    });
  }, [cartItems, navigate, totalAmount]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === "Online" && !formData.paymentId.trim()) {
      setMessage("❌ Transaction ID is required for Online Payment.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders/create", formData);
      setMessage("🎉 Order placed successfully!");
      setOrderPlaced(true);
      setShowPdfConfirmation(true);
      
      // No immediate navigation - we'll wait for user to decide on PDF
    } catch (err) {
      console.error("Error placing order:", err.response?.data || err.message);
      setMessage("❌ Failed to place order.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Order Receipt", 15, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Purchased By
    doc.setFont("helvetica", "bold");
    doc.text("Purchased By", 15, 35);
    doc.setFont("helvetica", "normal");
    doc.text(`Buyer Name: ${formData.username}`, 15, 42);
    doc.text(`Buyer Phone: ${formData.phone}`, 15, 49);
    doc.text(`Order ID: ${formData.orderId}`, 15, 56);
    doc.text(`Order Date: ${formData.orderDate}`, 15, 63);
    doc.text(`Order Type: Web-Online`, 15, 70);

    // Purchased From
    doc.setFont("helvetica", "bold");
    doc.text("Purchased From", pageWidth / 2 + 10, 35);
    doc.setFont("helvetica", "normal");
    doc.text("Organization Name: Sri Vaari Nursery Garden", pageWidth / 2 + 10, 42);
    doc.text("Event Address:", pageWidth / 2 + 10, 49);
    doc.text("Masakalipatti", pageWidth / 2 + 10, 56);
    doc.text("Namakkal,TamilNadu", pageWidth / 2 + 10, 63);
    doc.text("+91 94435 11253", pageWidth / 2 + 10, 70);

    // Divider Line
    doc.line(15, 75, pageWidth - 15, 75);

    // Order Summary Title
    doc.setFont("helvetica", "bold");
    doc.text("Order Summary", 15, 85);

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Ticket", 15, 95);
    doc.text("Face Value", 80, 95);
    doc.text("Qty", 140, 95);
    doc.text("Subtotal", 170, 95);

    // Calculate values correctly
    const faceValue = parseFloat(formData.totalAmount) / parseInt(formData.quantity);
    const quantity = parseInt(formData.quantity);
    const subtotal = parseFloat(formData.totalAmount);

    // Table Data
    doc.setFont("helvetica", "normal");
    doc.text(formData.plantName, 15, 103);
    doc.text(`${faceValue.toFixed(2)}`, 80, 103);
    doc.text(`${quantity}`, 140, 103);
    doc.text(`${subtotal.toFixed(2)}`, 170, 103);

    // Order Total
    doc.setFont("helvetica", "bold");
    doc.text(`Order Total: ${subtotal.toFixed(2)}`, 150, 115);

    // Billing Information
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 15, 130);
    doc.setFont("helvetica", "normal");
    doc.text(formData.username, 15, 137);
    doc.text(formData.paymentMethod === "Online" ? `Transaction ID: ${formData.paymentId}` : "Cash on Delivery", 15, 144);

    doc.save(`Order_${formData.orderId}.pdf`);
    
    // After PDF is generated, navigate to home
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <>
      {showQR && <QRModal qrImage={payment} onClose={() => setShowQR(false)} />}

      <div className="checkout-container">
        <h2>Checkout 🧾</h2>
        {message && <div className="success-message">{message}</div>}
        
        {showPdfConfirmation && (
          <div className="pdf-confirmation">
            <p>Would you like to download your order receipt as PDF?</p>
            <div className="pdf-buttons">
              <button 
                onClick={() => {
                  generatePDF();
                  setShowPdfConfirmation(false);
                }}
                className="btn btn-primary"
              >
                Yes, Download PDF
              </button>
              <button 
                onClick={() => {
                  setShowPdfConfirmation(false);
                  navigate("/");
                }}
                className="btn btn-secondary"
              >
                No, Return to Home
              </button>
            </div>
          </div>
        )}

        {!orderPlaced && (
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-columns">
              <div className="form-column">
                <div className="form-group">
                  <label className="label">Username:</label>
                  <span className="form-value">{formData.username}</span>
                </div>

                <div className="form-group">
                  <label className="label">Phone Number:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Date of Order:</label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label className="label">Plant Names:</label>
                  <span className="form-value">{formData.plantName}</span>
                </div>

                <div className="form-group">
                  <label className="label">Quantity:</label>
                  <span className="form-value">{formData.quantity}</span>
                </div>

                <div className="form-group">
                  <label className="label">Total Amount:</label>
                  <span className="form-value">₹{formData.totalAmount}</span>
                </div>

                <div className="form-group">
                  <label className="label">Payment Method:</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Online">Online Payment</option>
                  </select>
                </div>
              </div>
            </div>

            {formData.paymentMethod === "Online" && (
              <div className="payment-section">
                <div className="transaction-container">
                  <div className="form-group">
                    <label className="label">Transaction ID:</label>
                    <input
                      type="text"
                      name="paymentId"
                      value={formData.paymentId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="buttons-container">
              {formData.paymentMethod === "Online" && (
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className="qr-toggle-button"
                >
                  Show QR
                </button>
              )}
              <button type="submit" className="btn btn-success btn-lg float-right">
                Place Order
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default Checkout;