import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import { AppDispatch } from '../store/store';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector(
    (state: RootState) => state.products
  );
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Our Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-600 mt-8">No products found.</div>
      )}
    </div>
  );
};

export default ProductList;
