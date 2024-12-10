import con from '../config/database.js';

export const getProductDetails = (req, res) => {
  const { barcode } = req.params;

  const query = `
SELECT 
    p.product_id,
    p.product_name,
    p.barcode_num,
    p.price,
    ni.ingredients,
    ni.calories,
    GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
    GROUP_CONCAT(DISTINCT n.nutrient_name ORDER BY n.nutrient_name) AS nutrients,
    GROUP_CONCAT(DISTINCT nin.quantity ORDER BY nin.nutrient_id) AS nutrient_quantities
FROM 
    PRODUCTS p
INNER JOIN 
    NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
LEFT JOIN 
    NUTRITIONAL_INFO_NUTRIENT nin ON ni.nutritional_info_id = nin.nutritional_info_id
LEFT JOIN 
    NUTRIENT n ON nin.nutrient_id = n.nutrient_id
LEFT JOIN 
    ALLERGENS a ON ni.allergen_id = a.allergen_id
WHERE barcode_num = ${barcode}
GROUP BY 
    p.product_id, p.product_name, p.barcode_num, p.price, ni.ingredients, ni.calories;
  `;
  
  con.query(query, [barcode], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching product' });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(results[0]);
  });
};


export const addToRecentScans = (req, res) => {
  const { user_id, product_id } = req.body;
  console.log("Received request data:", { user_id, product_id });

  const query = `
    INSERT INTO RECENT_SCANS (user_id, product_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE scan_date = CURRENT_TIMESTAMP;
  `;

  con.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      console.error('Error adding recent scan:', err);
      return res.status(500).json({ message: 'Error adding recent scan' });
    }
    res.status(200).json({ message: 'Recent scan added successfully' });
  });
};

  
  
  export const getRecentScans = (req, res) => {
    const { user_id } = req.params; 
    console.log(req.query);
  
    const query = `
      SELECT p.product_name, p.barcode_num, rs.scan_date
      FROM RECENT_SCANS rs
      INNER JOIN PRODUCTS p ON rs.product_id = p.product_id
	    WHERE user_id = ?
      ORDER BY rs.scan_date DESC;
    `;
  
    con.query(query, [user_id], (err, results) => {
      if (err) {
        console.error('Error fetching recent scans:', err);
        return res.status(500).json({ message: 'Error fetching recent scans' });
      }
  
      res.status(200).json(results.length ? results : []);
    });
  };
  