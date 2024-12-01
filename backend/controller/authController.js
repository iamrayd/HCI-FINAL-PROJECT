import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import con from '../config/database.js';



// User Login Route
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Query database to find the user
  const query = 'SELECT * FROM USERS WHERE email = ?';
  con.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error during login query:', err);
      return res.status(500).json({ message: 'Server error during login' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Check if the provided password matches the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error during password comparison:', err);
        return res.status(500).json({ message: 'Server error during password check' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token (signed with a secret key)
      const token = jwt.sign(
        { user_id: user.user_id }, 
        process.env.JWT_SECRET,    
        { expiresIn: '1h' }        
      );

      // Respond with the token and user data
      res.status(200).json({
        message: 'Login Successful!',
        token: `Bearer ${token}`, // Send the token as a Bearer token
        user: { user_id: user.user_id, email: user.email }
      });
    });
  });
};

// User Signup Route (Create User)
export const signupUser  = (req, res) => {
  const { email, password, firstname, lastname, midint, gender, allergies = [], username } = req.body;

  if (!email || !password || !firstname || !lastname || !midint || !gender || !username) {
      return res.status(400).json({ error: 'All fields are required' });
  }


  const allergenIds = [];
  const allergyQueries = allergies.map(allergy => {
      return new Promise((resolve, reject) => {
          const allergyIdQuery = 'SELECT allergen_id FROM ALLERGENS WHERE allergen_name = ?';
          con.query(allergyIdQuery, [allergy], (err, rows) => {
              if (err) {
                  console.error(`Error retrieving allergen ID for '${allergy}':`, err);
                  return reject(err);
              }
              if (rows.length > 0) {
                  allergenIds.push(rows[0].allergen_id);
                  resolve();
              } else {
                  console.log(`Allergen "${allergy}" not found.`);
                  return reject(new Error(`Allergen "${allergy}" not found.`)); // Reject if allergen not found
              }
          });
      });
  });

  // Wait for all allergen ID retrievals to complete
  Promise.all(allergyQueries)
      .then(() => {
          // Step 2: Proceed with user insertion only if all allergens are valid
          return new Promise((resolve, reject) => {
              bcrypt.hash(password, 10, (err, hashedPassword) => {
                  if (err) {
                      console.error('Error hashing password:', err);
                      return reject({ error: 'Error hashing' });
                  }

                  const query = 'INSERT INTO USERS (firstname, lastname, email, password, midint, gender, username) VALUES (?, ?, ?, ?, ?, ?, ?)';
                  con.query(query, [firstname, lastname, email, hashedPassword, midint, gender, username], (err, results) => {
                      if (err) {
                          console.error('Error during signup query:', err);
                          return reject({ error: 'Error during signup query' });
                      }

                      const userId = results.insertId; 
                      console.log(userId);
                      resolve(userId); 
                  });
              });
          });
      })
      .then(userId => {
          // Step 3: Insert into USER_ALLERGENS
          const userAllergenQueries = allergenIds.map(allergenId => {
              return new Promise((resolve, reject) => {
                  const allergyInsertQuery = 'INSERT INTO USER_ALLERGENS (user_id, allergen_id) VALUES (?, ?)';
                  con.query(allergyInsertQuery, [userId, allergenId], (err) => {
                      if (err) {
                          console.error(`Error inserting allergy ID '${allergenId}' for user ID ${userId}:`, err);
                          return reject(err);
                      }
                      resolve();
                  });
              });
          });

          // Wait for all allergy inserts to complete
          return Promise.all(userAllergenQueries);
      })
      .then(userId => {
          const token = jwt.sign(
              { user_id: userId }, 
              process.env.JWT_SECRET,
              { expiresIn: '1h' }
          );

          res.status(201).json({
              message: 'Signup successful',
              token: `Bearer ${token}`,
              user: { user_id: userId, email }
          });
      })
      .catch(err => {
          console.error('Error during signup process:', err);
          return res.status(400).json({ error: err.message }); // Return error if any allergen is invalid
      });
};
