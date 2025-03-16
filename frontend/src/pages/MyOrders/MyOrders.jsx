import React, { useContext, useEffect, useState, useCallback } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url, token, currency, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Number of orders per page

  const statuses = ["Food Processing", "Out for delivery", "Delivered"];

  // Fetch Orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      const sortedOrders = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Newest orders first
      );
      setData(sortedOrders);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // WebSocket Real-Time Updates
  useEffect(() => {
    if (token) {
      fetchOrders();
      const socket = new WebSocket(`${url.replace("http", "ws")}/ws/orders`);

      socket.onmessage = (event) => {
        const newOrder = JSON.parse(event.data);
        setData((prevData) => [newOrder, ...prevData]); // Add new order on top
      };

      socket.onerror = () => console.error("WebSocket error occurred.");
      socket.onclose = () => console.log("WebSocket connection closed.");

      return () => {
        socket.close();
      };
    }
  }, [token, url]);

  // Track Order
  const handleTrackOrder = (orderId) => {
    console.log(`Tracking order with ID: ${orderId}`);
  };

  // Reorder Items
  const handleReorder = (orderItems) => {
    const newCartItems = {};
    orderItems.forEach((item) => {
      newCartItems[item._id] = item.quantity;
    });
    setCartItems(newCartItems);
    navigate("/");
  };

  // Update Order Status (Admin)
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${url}/api/order/updateStatus`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      setData((prevData) =>
        prevData.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      console.log(response.data.message);
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {loading && <p className="loading-text">Loading orders...</p>}
      {error && <p className="error">{error}</p>}
      <div className="orders-container">
        {currentOrders.length === 0 ? (
          <p className="no-orders-text">No orders found.</p>
        ) : (
          currentOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <img
                  className="order-image"
                  src={assets.parcel_icon}
                  alt="Parcel Icon"
                />
                <div className="order-status">
                  <span className={`status-dot ${order.status.toLowerCase()}`}>
                    &#x25cf;
                  </span>
                  <p className="order-status-text">{order.status}</p>
                </div>
              </div>

              <div className="order-info">
                <p className="order-items">
                  {order.items.map((item, index) => {
                    return `${item.name} x ${item.quantity}${
                      index < order.items.length - 1 ? ", " : ""
                    }`;
                  })}
                </p>
                <p className="order-amount">
                  {currency}
                  {order.amount}.00
                </p>
                <p className="order-date">
                  Ordered on: {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Order Status Timeline */}
              <div className="order-timeline">
                {statuses.map((status, index) => (
                  <div
                    key={index}
                    className={`timeline-step ${
                      order.status === status ? "active" : "inactive"
                    }`}
                    onClick={() => handleStatusUpdate(order.id, status)}
                  >
                    <div
                      className={`timeline-dot ${
                        order.status === status ? "active" : "inactive"
                      }`}
                    ></div>
                    <span>{status}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                <button
                  className="track-button"
                  onClick={() => handleTrackOrder(order.id)}
                >
                  Track Order
                </button>
                <button
                  className="reorder-button"
                  onClick={() => handleReorder(order.items)}
                >
                  Reorder
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(data.length / ordersPerPage) }).map(
          (_, index) => (
            <button
              key={index}
              className={`page-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default MyOrders;
