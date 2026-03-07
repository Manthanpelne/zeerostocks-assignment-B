const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true }
});

const InventorySchema = new mongoose.Schema({
  supplier_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Supplier', 
    required: true 
  },
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0.01 }
});

const Supplier = mongoose.model('Supplier', SupplierSchema);
const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = { Supplier, Inventory };