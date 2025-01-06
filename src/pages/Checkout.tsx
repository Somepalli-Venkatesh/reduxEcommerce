import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { OrderDetails } from '../types';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCity, FaCreditCard, FaDownload } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

const Checkout: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderDetails: OrderDetails = {
      ...formData,
      items: cartItems,
      total,
    };

    console.log('Order placed:', orderDetails);
    dispatch(clearCart());
    toast.success('Order placed successfully!');
    navigate('/order-confirmation');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Order Summary', 105, 15, { align: 'center' });

    // User Information
    doc.setFontSize(12);
    doc.text(`Full Name: ${formData.fullName}`, 10, 30);
    doc.text(`Email: ${formData.email}`, 10, 40);
    doc.text(`Address: ${formData.address}`, 10, 50);
    doc.text(`City: ${formData.city}`, 10, 60);
    doc.text(`Postal Code: ${formData.postalCode}`, 10, 70);

    // Order Items Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Items:', 10, 85);

    // Order Items List
    doc.setFont('helvetica', 'normal');
    let y = 95;
    cartItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.title} × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 10, y);
      y += 10;
    });

    // Total
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${total.toFixed(2)}`, 10, y + 10);

    // Save PDF
    doc.save('Order_Summary.pdf');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaMapMarkerAlt /> Address
            </label>
            <input
              type="text"
              name="address"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaCity /> City
              </label>
              <input
                type="text"
                name="city"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaCreditCard /> Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="**** **** **** ****"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
            <span>Order Summary</span>
            <button
              onClick={downloadPDF}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Download PDF"
            >
              <FaDownload size={20} />
            </button>
          </h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-gray-700">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-bold text-gray-800 text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
