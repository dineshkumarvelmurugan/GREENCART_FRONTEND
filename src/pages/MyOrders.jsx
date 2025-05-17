import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import './MyOrders.css';

function MyOrders({ user: propUser, isAdmin: propIsAdmin }) {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null); // For modal confirmation
  const ordersPerPage = 8;

  // Get user from localStorage if not provided as prop
  const localUser = React.useMemo(() => {
    return JSON.parse(localStorage.getItem('user')) || {};
  }, []);

  // Use prop values if provided, otherwise use localStorage values
  const user = propUser || localUser;
  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : localUser.isAdmin === true;

  useEffect(() => {
    fetchOrders();
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, startDate, endDate, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      if (!user || !user.username) {
        setError('Please Login to View Orders');
        setLoading(false);
        return;
      }

      const url = isAdmin
        ? 'https://greencart-backend-z9tq.onrender.com/api/orders'
        : `https://greencart-backend-z9tq.onrender.com/api/orders/user/${user.username}`;

      const res = await axios.get(url);

      // Sort orders by creation date (newest first)
      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError('Failed to fetch orders: ' + error.message);
      setLoading(false);
    }
  };

  // Add the updateStatus function
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`https://greencart-backend-z9tq.onrender.com/api/orders/update-status/${orderId}`, {
        status: newStatus,
      });

      // Update the orders state with the new status
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );

      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("❌ Failed to update status");
    }
  };

  // Updated delete flow to use modal instead of alert
  const confirmDelete = (id) => {
    setDeleteId(id); // This will show the modal
  };

  // Handle actual deletion when confirmed in modal
  const handleDelete = async () => {
    try {
      await axios.delete(`https://greencart-backend-z9tq.onrender.com/api/orders/${deleteId}`);
      fetchOrders();
      setDeleteId(null); // Close modal after successful deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    if (statusFilter !== 'All') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    if (startDate) {
      filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(endDate));
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

 

  const headers = [
    { label: 'Order ID', key: 'orderId' },
    { label: 'User', key: 'username' },
    { label: 'Plant', key: 'plantName' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Status', key: 'status' },
    { label: 'Date', key: 'createdAt' }
  ];

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  return (
    <div className="my-orders">
      <h2>{isAdmin ? 'All Orders' : 'My Orders'}</h2>

      {loading ? (
        <p>Loading Orders...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="filters">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shipping Out">Shipping Out</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Delivered">Delivered</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <CSVLink data={filteredOrders} headers={headers} filename="orders.csv">
              <button>Export CSV</button>
            </CSVLink>
          </div>

          {filteredOrders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  {isAdmin && <th>User</th>}
                  <th>Plant</th>
                  <th>Quantity</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Payment ID</th>
                  {isAdmin && <th>Update Status</th>}
                  {!isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order._id || order.orderId}>
                    <td>ORD-{String(order.orderId).padStart(3, '0')}</td>
                    {isAdmin && <td>{order.username}</td>}
                    <td>{order.plantName}</td>
                    <td>{order.quantity}</td>
                    <td>{order.totalAmount}</td>
                    <td>{order.status || 'Pending'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.paymentId || 'N/A'}</td>
                    {isAdmin && (
                      <td>
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipping Out">Shipping Out</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    )}

                    {!isAdmin && (
                      <td>
                        {order.status === 'Pending' ? (
                          <button
                            className="delete-btn"
                            onClick={() => confirmDelete(order._id)}
                          >🗑️ Delete</button>
                        ) : (
                          <span className="disabled-text">Cannot delete</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Orders Found</p>
          )}

          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button
              disabled={indexOfLast >= filteredOrders.length}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
          
          {/* Modal-like Delete Confirmation (not using alert) */}
          {deleteId && (
            <div className="modal-overlay">
              <div className="modal">
                <h4>Are you sure you want to delete this order?</h4>
                <div className="modal-buttons">
                  <button onClick={handleDelete} className="confirm-btn">Yes, Delete</button>
                  <button onClick={() => setDeleteId(null)} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyOrders;