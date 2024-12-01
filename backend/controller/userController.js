import con from '../config/database.js';

// GET ALL users from db
export const getAllUsers = (req, res) => {
  const query = 'SELECT * FROM USERS'; // Query to get all users

  con.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.stack);
      return res.status(500).json({ error: 'Error fetching users' });
    }

    res.status(200).json({
      message: 'All users fetched successfully',
      users: results,
    });
  });
};

// GET a single user by ID from db
export const getUserById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM USERS WHERE user_id = ?'; // Query for a user by ID

  con.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err.stack);
      return res.status(500).json({ error: 'Error fetching user' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }

    res.status(200).json({
      message: `User with ID ${id} fetched successfully`,
      user: results[0],
    });
  });
};


// PUT (update) a user by ID
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstname, midint, lastname, email, gender, password } = req.body;

  // Validate required fields
  if (!firstname || !lastname || !email || !password || !gender) {
    return res.status(400).json({ error: 'Firstname, lastname, email, password, and gender are required' });
  }

  // Ensure gender is either 'M' or 'F'
  if (gender !== 'M' && gender !== 'F') {
    return res.status(400).json({ error: 'Gender must be either M or F' });
  }

  const query = 'UPDATE USERS SET firstname = ?, lastname = ?, email = ?, password = ?, midint = ?, gender = ? WHERE user_id = ?';

  con.query(query, [firstname, lastname, email, password, midint, gender, id], (err, results) => {
    if (err) {
      console.error('Error updating user:', err.stack);
      return res.status(500).json({ error: 'Error updating user' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }

    res.status(200).json({
      message: `User with ID ${id} updated successfully`,
      user: { user_id: id, firstname, lastname, email, midint, gender },
    });
  });
};

// DELETE a user by ID
export const deleteUser = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM USERS WHERE user_id = ?';

  con.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err.stack);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }

    res.status(200).json({
      message: `User with ID ${id} deleted successfully`,
    });
  });
};

// Email duplication check
export const checkEmail = async (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM USERS WHERE email = ?';
  
  con.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Error checking email.' });
    }
    
    if (results.length > 0) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  });
};


