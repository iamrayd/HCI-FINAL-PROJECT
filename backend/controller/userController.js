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

// Assuming you already have a function to handle database queries
export const removeAllergen = (req, res) => {
  const { user_id, allergen_name } = req.body; // Get the user_id and allergen_name from the request body

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

    // If no rows are affected, it means the allergen wasn't found
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Allergen not found' });
    }

    res.status(200).json({ message: 'Allergen removed successfully' });
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
