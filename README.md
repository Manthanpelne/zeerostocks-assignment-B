# Assignment B: Inventory Database & Aggregation API

This backend service manages the relationship between Suppliers and their surplus Inventory. This ensures data integrity and provides an optimized reporting endpoint using MongoDB's Aggregation pipeline framework.

---

## 🛠️ Database Schema Explaination & Relationship
I have implemented a **One-to-Many** relationship between two collections:
1.  **Suppliers**: Stores core supplier data (`name`, `city`).
2.  **Inventory**: Stores stock details (`product_name`, `quantity`, `price`) and maintains a reference with via `supplier_id`.
**Why Referenced?**
By using a reference model, the `Suppliers` collection maintains one to many relationship,acting as single source of truth. If a supplier changes their name or location, we only update it in one place, preventing data inconsistency across thousands of inventory items.

---

## 🚀 Choice of Technology: NoSQL (MongoDB)

I chose **MongoDB** for this assignment for two primary reasons:

1.  **Schema Flexibility**: Surplus inventory can be having varying attributes.So, NoSQL allows us to easily add fields like "expiration date" or any new field in the future without complex migrations.
2.  **Aggregation Framework**: It allows for powerful, multi-stage data processing using aggregation pipelines. The `GET /inventory` endpoint performs a join ($lookup), calculates values ($multiply), groups data ($group), and sorts results in a single, efficient database result which helps us in fetching the result data seemlessly.



---

## 📈 Optimization Suggestion

### Indexing on `supplier_id`
We can create a **Single Field Ascending Index** on the `supplier_id` field within the `Inventory` collection as given below:
```javascript
inventorySchema.index({ supplier_id: 1 });

Without indexing, when we run our aggregation (especially the $group or $lookup stages), It looks at every single document in our inventory collection to see which ones match a specific supplier_id.
With the indexing, MongoDB performs index scan. It looks at a sorted B-Tree structure of IDs, which allows it to find the matching records almost instantly. 
This will helps us in database performance optimization, faster data retrieval output.


