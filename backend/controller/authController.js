import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import con from '../config/database.js';

// User Login
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const query = 'SELECT * FROM USERS WHERE email = ?';
  con.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error during login' });

    if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        message: 'Login successful!',
        token: `Bearer ${token}`,
        user: { user_id: user.user_id, email: user.email },
      });
    });
  });
};

// User Signup
export const signupUser = (req, res) => {
  const { email, password, firstname, lastname, midint, gender, allergies, username } = req.body;

  if (!email || !password || !firstname || !lastname || !midint || !gender || !username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate allergens
  const allergenIds = [];
  const allergyQueries = allergies.map(allergy => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT allergen_id FROM ALLERGENS WHERE allergen_name = ?';
      con.query(query, [allergy], (err, rows) => {
        if (err) return reject(err);
        if (rows.length > 0) {
          allergenIds.push(rows[0].allergen_id);
          resolve();
        } else {
          reject(new Error(`Allergen ${allergy} not found`));
        }
      });
    });
  });

  Promise.all(allergyQueries)
    .then(() => bcrypt.hash(password, 10))
    .then(hashedPassword => {
      const query = 'INSERT INTO USERS (firstname, lastname, email, password, midint, gender, username) VALUES (?, ?, ?, ?, ?, ?, ?)';
      con.query(query, [firstname, lastname, email, hashedPassword, midint, gender, username], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error during signup' });

        const userId = result.insertId;
        const userAllergenQueries = allergenIds.map(allergenId => {
          return new Promise((resolve, reject) => {
            const query = 'INSERT INTO USER_ALLERGENS (user_id, allergen_id) VALUES (?, ?)';
            con.query(query, [userId, allergenId], err => (err ? reject(err) : resolve()));
          });
        });

        return Promise.all(userAllergenQueries);
      });
    })
    .then(() => {
      const token = jwt.sign({ user_id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({
        message: 'Signup successful',
        token: `Bearer ${token}`,
        user: { user_id: result.insertId, email },
      });
    })
    .catch(err => res.status(400).json({ error: err.message }));
};
