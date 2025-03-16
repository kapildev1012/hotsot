import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const FoodItem = ({ image, name, price, desc, id, category }) => {
  const [isExtraCheese, setIsExtraCheese] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Medium"); // Default size: Medium

  const { cartItems, addToCart, removeFromCart, url, currency } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Handle extra cheese selection
  const handleExtraCheese = () => {
    setIsExtraCheese(!isExtraCheese);
  };

  // Handle pizza size selection
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  // Adjust price based on size
  const getSizePrice = () => {
    let sizePrice = price;
    if (selectedSize === "Small") sizePrice -= 20;
    if (selectedSize === "Large") sizePrice += 30;
    return sizePrice;
  };

  // Handle adding item to cart
  const handleAddToCart = () => {
    const extraCheesePrice = isExtraCheese ? 50 : 0;
    addToCart(id, getSizePrice() + extraCheesePrice); // Pass adjusted price
  };

  // Handle going to cart
  const handleGoToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt={name}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              onClick={() => removeFromCart(id)}
              alt="Remove"
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              onClick={handleAddToCart}
              alt="Add"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p> <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{desc}</p>

        {/* Pizza Size Selection (Only for Pizza) */}
        {category === "Veg Pizza" && (
          <div className="pizza-size-selector">
            <label>Select Size:</label>
            <select value={selectedSize} onChange={handleSizeChange}>
              <option value="Small">Small (-₹20)</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large (+₹30)</option>
            </select>
          </div>
        )}

        {/* Extra Cheese Option (Only for Pizza) */}
        {category === "Pizza" && (
          <div className="extra-cheese-option">
            <label>
              <input
                type="checkbox"
                checked={isExtraCheese}
                onChange={handleExtraCheese}
              />
              Add Extra Cheese (+₹50)
            </label>
          </div>
        )}

        <div className="food-item-price-container">
          <p className="food-item-price">
            {currency}
            {getSizePrice() + (isExtraCheese ? 50 : 0)}
          </p>
          <button className="go-to-cart-btn" onClick={handleGoToCart}>
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
