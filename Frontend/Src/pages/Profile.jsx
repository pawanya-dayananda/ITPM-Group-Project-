import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaBox, FaPlus } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import ProductFormModal from '../components/ProductFormModal';
import { useUserStore } from '../store/userStore';
import { useProductStore } from '../store/productStore';

const Profile = ({ onNavigate }) => {
  const { user } = useUserStore();
  const { userProducts, loading, fetchUserProducts } = useProductStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserProducts(user.id);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="profile" onNavigate={onNavigate} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-4xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* My Products */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaBox className="text-green-600" />
              My Products ({userProducts.length})
            </h2>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaPlus /> Add Product
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
            </div>
          ) : userProducts.length === 0 ? (
            <div className="text-center py-12">
              <FaBox className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6">You haven't added any products yet</p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProducts.map(product => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  {product.image && (
                    <img src={product.image} alt={product.ProductName} className="w-full h-48 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{product.ProductName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.Description}</p>
                  <p className="text-green-600 font-bold text-lg mb-3">₹{product.Price}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          setModalOpen={setModalOpen}
          fetchProducts={fetchUserProducts}
          editingProduct={editingProduct}
          onProductCreated={() => {
            setModalOpen(false);
            setEditingProduct(null);
            if (user?.id) {
              fetchUserProducts(user.id);
            }
          }}
        />
      )}
    </div>
  );
};

export default Profile;
