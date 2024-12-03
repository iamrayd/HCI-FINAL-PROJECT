import con from '../config/database.js';

// Get all users
export const getAllUsers = (req, res) => {
  const query = 'SELECT * FROM USERS';
  con.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.status(200).json({ users: results });
  });
};

// Get user by ID
export const getUserById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM USERS WHERE user_id = ?';
  con.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user: results[0] });
  });
};

// Update user
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

// Delete user
export const deleteUser = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM USERS WHERE user_id = ?';
  con.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error deleting user' });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

// Check email existence
export const checkEmail = (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM USERS WHERE email = ?';
  con.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error checking email' });
    res.status(200).json({ exists: results.length > 0 });
  });
};

// Get user allergens
export const getUserAllergens = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT a.allergen_name
    FROM USER_ALLERGENS ua
    JOIN ALLERGENS a ON ua.allergen_id = a.allergen_id
    WHERE ua.user_id = ?
  `;
  con.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching allergens' });
    res.status(200).json({ allergens: results.map(item => item.allergen_name) });
  });
};
