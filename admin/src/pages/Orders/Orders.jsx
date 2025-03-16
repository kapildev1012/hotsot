import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { url, currency } from "../../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all orders from the API
  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const sortedOrders = response.data.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((order, index) => ({
            ...order,
            orderId: response.data.data.length - index,
          }));
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        toast.error("Failed to fetch orders. Try again.");
      }
    } catch (error) {
      toast.error("Network error! Unable to fetch orders.");
    }
    setLoading(false);
  };

  // Handle order status change
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
      });
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setFilteredOrders((prevFiltered) =>
          prevFiltered.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order #${orderId} updated to "${newStatus}"`);
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      toast.error("Error updating order status. Please try again.");
    }
  };

  // Handle date filtering
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    if (date) {
      const filtered = orders.filter(
        (order) => new Date(order.date).toISOString().split("T")[0] === date
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  // Handle search by customer name
  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      const filtered = orders.filter((order) =>
        `${order.address.firstName} ${order.address.lastName}`
          .toLowerCase()
          .includes(term)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order-container">
      <h2>Order Management</h2>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="order-date">Filter by Date:</label>
          <input
            type="date"
            id="order-date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="search-name">Search by Customer:</label>
          <input
            type="text"
            id="search-name"
            placeholder="Enter name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length > 0 ? (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="order-card">
              <h3 className="order-id">Order #{order.orderId}</h3>

              {/* Order Details */}
              <div className="order-section">
                <h4>Order Details</h4>
                <p>
                  <strong>Ordered On:</strong>{" "}
                  {new Date(order.date).toLocaleString()}
                </p>
                <p>
                  <strong>Total Items:</strong> {order.items.length}
                </p>
                <p>
                  <strong>Total Amount:</strong> {currency} {order.amount}
                </p>
              </div>

              {/* Items Ordered */}
              <div className="order-section">
                <h4>Items Ordered</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Information */}
              <div className="order-section">
                <h4>Customer Details</h4>
                <p>
                  <strong>Name:</strong> {order.address.firstName}{" "}
                  {order.address.lastName}
                </p>
                <p>
                  <strong>Phone:</strong> {order.address.phone}
                </p>
                <p>
                  <strong>Delivery Address:</strong>
                </p>
                <p>
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state}, {order.address.country} -{" "}
                  {order.address.zipcode}
                </p>
              </div>

              {/* Order Status */}
              <div className="order-section">
                <h4>Order Status</h4>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders available for the selected filters.</p>
      )}
    </div>
  );
};

export default Order;
