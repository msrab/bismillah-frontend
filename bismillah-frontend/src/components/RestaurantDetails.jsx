import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => {
        setRestaurant(data.restaurant || data); // selon ta structure de réponse
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{textAlign: 'center', marginTop: 40}}>Chargement...</p>;
  if (!restaurant) return <p style={{textAlign: 'center', marginTop: 40}}>Restaurant introuvable.</p>;

  return (
    <div className="restaurant-detail-page">
      <Link to="/restaurants" style={{margin: "24px 0", display: "inline-block", color: "#e63946"}}>&larr; Retour à la liste</Link>
      <div className="restaurant-detail-card">
        <img
          src={restaurant.logo || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
          alt={restaurant.name}
          className="restaurant-detail-img"
        />
        <div className="restaurant-detail-info">
          <h2>{restaurant.name}</h2>
          <p><b>Adresse :</b> {restaurant.address_number} {/* Ajoute la rue/ville si dispo */}</p>
          <p><b>Téléphone :</b> {restaurant.phone}</p>
          <p><b>Email :</b> {restaurant.email}</p>
          <p><b>Followers :</b> {restaurant.nb_followers}</p>
        </div>
      </div>
      <style>{`
        .restaurant-detail-page {
          max-width: 700px;
          margin: 40px auto 0 auto;
          padding: 0 16px 40px 16px;
        }
        .restaurant-detail-card {
          display: flex;
          gap: 32px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          padding: 32px;
          align-items: center;
        }
        .restaurant-detail-img {
          width: 220px;
          height: 220px;
          object-fit: cover;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(230,57,70,0.08);
        }
        .restaurant-detail-info h2 {
          color: #e63946;
          margin-bottom: 18px;
        }
        .restaurant-detail-info p {
          margin: 8px 0;
          color: #444;
        }
        @media (max-width: 700px) {
          .restaurant-detail-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .restaurant-detail-img {
            width: 100%;
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}

export default RestaurantDetail;