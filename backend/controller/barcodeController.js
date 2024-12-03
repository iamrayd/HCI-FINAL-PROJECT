import con from '../config/database.js';

// Get product details by barcode
export const getProductDetails = (req, res) => {
  const { barcode } = req.params;

  const query = `
    SELECT p.product_name, p.price, ni.ingredients, ni.calories, GROUP_CONCAT(DISTINCT a.allergen_name) AS allergens
    FROM PRODUCTS p
    JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE p.barcode_num = ?
    GROUP BY p.product_id
  `;
  
  con.query(query, [barcode], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching product' });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(results[0]);
  });
};
