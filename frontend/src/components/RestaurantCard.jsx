function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <img
        src={restaurant.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
        alt={restaurant.name}
      />
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p>{restaurant.description || "Restaurant sans description."}</p>
        <p style={{fontWeight: 500, color: "#e63946"}}>{restaurant.city?.name || ""}</p>
      </div>
    </div>
  );
}

export default RestaurantCard;