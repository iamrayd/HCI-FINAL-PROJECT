import con from '../config/database.js';

export const checkEmail = (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM USERS WHERE email = ?';
  con.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error checking email' });
    res.status(200).json({ exists: results.length > 0 });
  });
};

export const getUserAllergens = (req, res) => {
  const { user_id } = req.params;
  const query = `
    SELECT a.allergen_name
    FROM USER_ALLERGENS ua
    JOIN ALLERGENS a ON ua.allergen_id = a.allergen_id
    WHERE ua.user_id = ${user_id}
  `;
  con.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching allergens' });
    res.status(200).json({ allergens: results.map(item => item.allergen_name) });
  });
};

export const removeAllergen = (req, res) => {
  const { user_id, allergen_name } = req.body; 

  if (!user_id || !allergen_name) {
    return res.status(400).json({ message: 'User ID and allergen name are required' });
  }

  const query = `
    DELETE FROM USER_ALLERGENS 
    WHERE user_id = ? AND allergen_id = (
      SELECT allergen_id FROM ALLERGENS WHERE allergen_name = ? LIMIT 1
    );
  `;

  con.query(query, [user_id, allergen_name], (err, results) => {
    if (err) {
      console.error('Error removing allergen:', err);
      return res.status(500).json({ message: 'Error removing allergen' });
    }

    // if allergen not found
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Allergen not found' });
    }

    res.status(200).json({ message: 'Allergen removed successfully' });
  });
};


export const getFavorites = (req, res) => {
  const { user_id } = req.params;
  
  const query = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens 
    FROM 
    USER_FAVORITES uf
    JOIN 
      PRODUCTS p ON uf.product_id = p.product_id
    INNER JOIN 
      NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN 
      NUTRITIONAL_INFO_NUTRIENT nin ON ni.nutritional_info_id = nin.nutritional_info_id
    LEFT JOIN 
      NUTRIENT n ON nin.nutrient_id = n.nutrient_id
    LEFT JOIN 
      ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE user_id = ${user_id}
    GROUP BY 
    p.product_id, p.product_name, p.barcode_num, p.price, ni.ingredients, ni.calories;
  `;

  con.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching favorite products:", err);
      return res.status(500).json({ message: 'Error fetching favorites' });
    }

    res.status(200).json(results); 
  });
};

export const deleteFavorite = (req, res) => {
  const { user_id, product_id } = req.body;

  const query = `
    DELETE FROM USER_FAVORITES 
    WHERE user_id = ? AND product_id = ?;
  `;
  
  con.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("Error removing product from favorites:", err);
      return res.status(500).json({ message: 'Error removing product from favorites' });
    }

    res.status(200).json({ message: 'Product removed from favorites successfully' });
  });
};

export const addFavorite = (req, res) => {
  const { user_id, product_id } = req.body;
  console.log("Received request data:", { user_id, product_id });
  const query = `
    INSERT INTO USER_FAVORITES (user_id, product_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE product_id = product_id;  
  `;

  con.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("Error adding product to favorites:", err);
      return res.status(500).json({ message: 'Error adding product to favorites' });
    }

    res.status(200).json({ message: 'Product added to favorites successfully' });
  });
};


export const getAllScanHistory = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM USER_ALLERGENS ua
          WHERE ua.user_id = rs.user_id
          AND ua.allergen_id IN (SELECT allergen_id FROM NUTRITIONAL_INFO ni2 WHERE ni2.product_id = p.product_id)
        ) THEN 'Detected'
        ELSE 'Safe'
      END AS allergen_status
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = ?
    GROUP BY p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients
    ORDER BY 5;
  `;

  con.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching scan history:", err);
      return res.status(500).json({ message: 'Error fetching scan history' });
    }
    res.status(200).json(results);
  });
};

// Fetch safe scan history
export const getSafeScanHistory = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
      'Safe' AS allergen_status
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = ? 
    AND NOT EXISTS (
      SELECT 1
      FROM USER_ALLERGENS ua
      WHERE ua.user_id = rs.user_id
      AND ua.allergen_id IN (SELECT allergen_id FROM NUTRITIONAL_INFO ni2 WHERE ni2.product_id = p.product_id)
    )
    GROUP BY p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients;
  `;

  con.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching safe scan history:", err);
      return res.status(500).json({ message: 'Error fetching safe scan history' });
    }
    res.status(200).json(results);
  });
};

export const getDetectedScanHistory = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      p.product_id, 
      p.product_name, 
      p.barcode_num, 
      p.price, 
      rs.scan_date AS date,
      ni.ingredients, 
      GROUP_CONCAT(DISTINCT a.allergen_name ORDER BY a.allergen_name) AS allergens,
      'Detected' AS allergen_status
    FROM RECENT_SCANS rs
    JOIN PRODUCTS p ON rs.product_id = p.product_id
    LEFT JOIN NUTRITIONAL_INFO ni ON p.product_id = ni.product_id
    LEFT JOIN ALLERGENS a ON ni.allergen_id = a.allergen_id
    WHERE rs.user_id = ? 
    AND EXISTS (
      SELECT 1
      FROM USER_ALLERGENS ua
      WHERE ua.user_id = rs.user_id
      AND ua.allergen_id IN (SELECT allergen_id FROM NUTRITIONAL_INFO ni2 WHERE ni2.product_id = p.product_id)
    )
    GROUP BY p.product_id, p.product_name, p.barcode_num, p.price, rs.scan_date, ni.ingredients;
  `;

  con.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching detected scan history:", err);
      return res.status(500).json({ message: 'Error fetching detected scan history' });
    }
    res.status(200).json(results);
  });
};







/*
export const getAllUsers = (req, res) => {
  const query = 'SELECT * FROM USERS';
  con.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.status(200).json({ users: results });
  });
};

export const getUserById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM USERS WHERE user_id = ?';
  con.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user: results[0] });
  });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, gender, password } = req.body;
  const query = 'UPDATE USERS SET firstname = ?, lastname = ?, email = ?, password = ?, gender = ? WHERE user_id = ?';
  con.query(query, [firstname, lastname, email, password, gender, id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error updating user' });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully' });
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM USERS WHERE user_id = ?';
  con.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error deleting user' });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
};
*/
