import express from "express"
import mysql from "mysql"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"project4",
})

con.connect(function(err) {
    if(err) { 
        console.log("Error in Connection");
        console.log(err);
    } else {
        console.log("SQL server Connected");
    }
})
app.listen(8081, ()=> {
    console.log("Running");
})


app.post('/signup', (req, res) => {
    const { firstname,lastname,username,email,contactNo, password, confirmPassword, userType,} = req.body;

    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    // Check if the user already exists (You should implement your own logic here)
    const query = `SELECT * FROM ${userType}s WHERE email = ?`;
    con.query(query, [email], (err, results) => {
      if (err) {
        console.error('Database error: ', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // Insert the user/landlord data into the respective table
      const insertQuery = `INSERT INTO ${userType}s (firstname, lastname, username, email, contact_no, password) VALUES (?, ?, ?, ?, ?, ?)`;
      con.query( insertQuery, [firstname, lastname, username, email, contactNo, password],
        (err) => {
          if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({ message: 'Server error' });
          }
          return res.status(200).json({ message: 'Signup successful' });
        }
      );
    });
  });
  
  app.post('/login', (req, res) => {
    const { email, password, userType } = req.body;
    
    // Choose the appropriate table based on the user type
    const tableName = userType === 'user' ? 'users' : 'landlords';
  
    // Query the database for the user
    const query = `SELECT * FROM ${tableName} WHERE email = ? AND password = ?`;
  
    con.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (results.length === 1) {
        // Successful login
        return res.status(200).json({ message: 'Login successful' });
      } else {
        // Invalid credentials
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  });