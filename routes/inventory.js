const express = require("express");
const router = express.Router();
const { Supplier, Inventory } = require("../models/Schemas");

// POST /supplier
router.post("/supplier", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// POST /inventory
router.post("/inventory", async (req, res) => {
  try {
    // Rule: Must belong to a valid supplier
    const isSupplierExists = await Supplier.findById(req.body.supplier_id);
    if (!isSupplierExists)
      return res.status(404).json({ error: "Supplier not found" });

    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// GET /inventory 
router.get("/inventory", async (req, res) => {
  try {
    //aggregation pipeline for output of all inventory group by supplier, sorted by total inventory value
    const results = await Inventory.aggregate([
      {
        // Calculating value for each document
        $addFields: { totalValue: { $multiply: ["$quantity", "$price"] } },
      },
        {
            $group: {
                _id: "$supplier_id", // Group by the supplier
                totalInventoryValue: { $sum: "$totalValue" }, // Calculating sum
                items: { $push: "$$ROOT" } // Keeping all original product details (name, qty, etc.)
            }
         },
      {
        // Joining with Supplier collection to get the name
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      { $unwind: "$supplierDetails" },
      { $sort: { totalInventoryValue: -1 } }, // Sorting by highest value
{
  $project: {
    "items.__v": 0,
    "supplierDetails.__v": 0,
    "items.supplier_id": 0 
  }
}
    ])

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
