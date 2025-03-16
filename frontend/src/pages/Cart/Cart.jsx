import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge,
    setCartItems,
  } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handleApplyPromoCode = () => {
    const validPromoCode = "DISCOUNT10"; // A placeholder valid promo code
    if (promoCode === validPromoCode) {
      setDiscount(10); // Apply a 10% discount
    } else {
      setDiscount(0);
    }
  };

  const handleQuantityChange = (itemId, action) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (action === "increase") {
        updatedItems[itemId] = (updatedItems[itemId] || 0) + 1;
      } else if (action === "decrease") {
        if (updatedItems[itemId] > 1) {
          updatedItems[itemId] -= 1;
        } else {
          delete updatedItems[itemId];
        }
      } else if (action === "remove") {
        delete updatedItems[itemId];
      }
      return updatedItems;
    });
  };

  const subtotal = getTotalCartAmount();
  const totalWithDelivery =
    subtotal < 200 ? subtotal + deliveryCharge : subtotal;
  const finalTotal = totalWithDelivery - totalWithDelivery * (discount / 100);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat().format(amount.toFixed(2));
  };

  return (
    <div className="cart">
      {food_list.length === 0 || Object.keys(cartItems).length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Browse our store and add some items to your cart.</p>
          <button onClick={() => navigate("/")}>Go to Menu</button>
        </div>
      ) : (
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Item</p> <p>Price</p> <p>Quantity</p> <p>Actions</p>
          </div>
          <hr />
          {food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={index} className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>
                    {currency}
                    {item.price * cartItems[item._id]}
                  </p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item._id, "decrease")}
                    >
                      -
                    </button>
                    <span>{cartItems[item._id]}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, "increase")}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleQuantityChange(item._id, "remove")}
                  >
                    Remove
                  </button>
                  <hr />
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency}
                {formatCurrency(subtotal)}
              </p>
            </div>
            <hr />
            {subtotal < 200 && (
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>
                  {currency}
                  {formatCurrency(deliveryCharge)}
                </p>
              </div>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {formatCurrency(finalTotal)}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
          <button className="add-more-items" onClick={() => navigate("/")}>
            ADD MORE ITEMS
          </button>
          {subtotal < 200 && (
            <p className="delivery-info">
              Note: Delivery fee applies for orders under {currency}200.
            </p>
          )}
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={handlePromoCodeChange}
              />
              <button onClick={handleApplyPromoCode}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
