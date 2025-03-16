import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [extraCheeseItems, setExtraCheeseItems] = useState({});

  const handleExtraCheese = (itemId, isExtraCheese) => {
    setExtraCheeseItems((prev) => ({
      ...prev,
      [itemId]: isExtraCheese,
    }));
  };

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                image={item.image}
                name={item.name}
                desc={item.description}
                price={item.price}
                id={item._id}
                onExtraCheese={handleExtraCheese}
                showSizeOptions={item.category.toLowerCase() === "pizza"} // Show size options only for pizza
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
