import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const con = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME
});

try {
  con.connect(function(err) {
    if(err) {
      console.error("Connection error: ", err.message);
      return;
    }
    console.log("Connected to MySQL database");
  });
} catch (err) {
  console.log("Unexpected error: ", err.message)
}

export default con;
