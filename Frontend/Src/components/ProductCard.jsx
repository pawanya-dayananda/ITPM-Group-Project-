import React from 'react';
import { motion } from 'framer-motion';
import { FaBox } from 'react-icons/fa';
import '../styles/product.css';

const ProductCard = ({ product, onClick }) => {
    const { _id, ProductName, ProductType, Price, Description, Quantity, status, image } = product;

    const getStatusClass = (status) => {
        switch (status) {
            case 'Available':
                return 'status-available';
            case 'Sold':
                return 'status-sold';
            default:
                return 'status-reserved';
        }
    };

    return (
        <motion.div
            key={_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="product-card"
            onClick={() => onClick(product)}
        >
            <div className="product-image-container">
                {image ? (
                    <img
                        src={image}
                        alt={ProductName}
                        className="product-image"
                    />
                ) : (
                    <div className="product-image-placeholder">
                        <FaBox className="placeholder-icon" />
                    </div>
                )}
                <div className="product-status">
                    <span className={`status-badge ${getStatusClass(status)}`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="product-content">
                <h3 className="product-title">{ProductName}</h3>
                <p className="product-type">{ProductType}</p>

                <div className="product-price">
                    <span className="price-symbol">$</span>
                    <span className="price-amount">{Price}</span>
                </div>

                <p className="product-description">
                    {Description}
                </p>

                <div className="product-footer">
                    <span className="product-quantity">Qty: {Quantity}</span>
                    <span className="view-details">
                        View Details <span className="arrow">→</span>
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
