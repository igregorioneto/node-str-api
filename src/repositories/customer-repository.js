'use strinct';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.createCustomer = async (data) => {
  const customer = new Customer(data);
  await customer.save();
}