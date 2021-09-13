'use strinct';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async () => {
  const res = await Order
    .find({}, 'number status customer')
    .populate('customer', 'name')
    .populate('product', 'title');
  return res;
}

exports.createOrder = async (data) => {
  const order = new Order(data);
  await order.save();
}