import express from "express"
import mysql from "mysql"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from "body-parser";
import multer from "multer";
import path from 'path'; 

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

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store property images in a specific folder
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

app.use('/uploads', express.static('uploads'));

// Initialize Multer
const upload = multer({ storage: storage });


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
        if (userType === 'landlord') {
          const landlordId = results[0].landlord_id; // Assuming there's a "landlord_id" field in the database
          console.log('Logged in as a landlord. Landlord ID:', landlordId);
          return res.status(200).json({ message: 'Login successful', landlordId });
        } else if (userType === 'user') {
          const userId = results[0].user_id; // Assuming there's a "user_id" field in the database
          console.log('Logged in as a user. User ID:', userId);
          return res.status(200).json({ message: 'Login successful', userId });
        } else {
          return res.status(200).json({ message: 'Login successful' });
        }
      } else {
        // Invalid credentials
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  });


// Create an API endpoint to handle property image uploads
app.post('/properties/add', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  // Log data sent to the server
  console.log('Received data from the frontend:');
  console.log('landlord_id:', req.body.landlord_id);
  console.log('property_type:', req.body.property_type);
  console.log('property_name:', req.body.property_name);
  console.log('location:', req.body.location);
  console.log('rent:', req.body.rent);
  console.log('bedrooms:', req.body.bedrooms);
  console.log('max_members:', req.body.max_members);
  console.log('description:', req.body.description);
  console.log('imagePath:', req.file.path);

  const imagePath = req.file.path;
  const { landlord_id, property_type, property_name, location, rent, bedrooms, max_members, description } = req.body;

  // Save the imagePath in the 'properties' table
  const sql = 'INSERT INTO properties (landlord_id, property_type, property_name, location, rent, bedrooms, max_members, description, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [landlord_id, property_type, property_name, location, rent, bedrooms, max_members, description, imagePath];

  con.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload property.' });
    }
    res.json({ success: 'Property uploaded successfully.' });
  });
});


app.get('/properties', (req, res) => {
  const landlordId = req.query.landlord_id; // Get landlord_id from query parameters
  // Query the database to retrieve property information based on landlord_id
  const sql = 'SELECT * FROM properties WHERE landlord_id = ?';
  con.query(sql, [landlordId], (err, result) => {
    if (err) {
      console.error('Error fetching properties:', err);
      return res.status(500).json({ error: 'Failed to fetch properties.' });
    }
    res.json(result); // Return the list of properties as JSON
  });
});

app.get('/displayproperties', (req, res) => {
  // Query the database to retrieve property information with landlord contact_no
  const sql = 'SELECT p.*, l.contact_no AS contact_no FROM properties p JOIN landlords l ON p.landlord_id = l.landlord_id';
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching properties:', err);
      return res.status(500).json({ error: 'Failed to fetch properties.' });
    }
    res.json(result); // Return the list of properties with landlord contact_no as JSON
  });
});


// Delete a property by property_id
app.delete('/propertiesdelete/:property_id', (req, res) => {
  const propertyId = req.params.property_id;
  con.query('DELETE FROM properties WHERE property_id = ?', [propertyId], (err, result) => {
    if (err) {
      console.error('Error deleting property:', err);
      res.status(500).json({ error: 'Failed to delete property.' });
    } else {
      res.status(200).json({ message: 'Property deleted successfully.' });
    }
  });
});


app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  con.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching users data:', err);
      return res.status(500).json({ error: 'Failed to fetch users data.' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'user not found.' });
    }
    const user = result[0];
    res.json(user);
  });
});

app.get('/properties/:property_id', (req, res) => {
  const propertyId = req.params.property_id;
  // Query the database to retrieve the property information based on property_id
  const sql = 'SELECT * FROM properties WHERE property_id = ?';
  con.query(sql, [propertyId], (err, result) => {
    if (err) {
      console.error('Error fetching property:', err);
      return res.status(500).json({ error: 'Failed to fetch property.' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    // Property data found, return it as JSON
    const property = result[0];
    res.json(property);
  });
});


// Route to update property data, allowing partial updates
app.put('/properties/edit/:property_id', upload.single('image'), (req, res) => {
  const propertyId = req.params.property_id;
  // Extract property data from the request
  const {
    property_type,
    property_name,
    location,
    rent,
    bedrooms,
    max_members,
    description,
  } = req.body;

  // Check if an image was uploaded
  const image = req.file ? req.file.path : undefined;

  // Construct SQL query to update property data
  let sql = 'UPDATE properties SET ';
  let updatedData = [];
  if (property_type) {
    sql += 'property_type = ?, ';
    updatedData.push(property_type);
  }
  if (property_name) {
    sql += 'property_name = ?, ';
    updatedData.push(property_name);
  }
  if (location) {
    sql += 'location = ?, ';
    updatedData.push(location);
  }
  if (rent) {
    sql += 'rent = ?, ';
    updatedData.push(rent);
  }
  if (bedrooms) {
    sql += 'bedrooms = ?, ';
    updatedData.push(bedrooms);
  }
  if (max_members) {
    sql += 'max_members = ?, ';
    updatedData.push(max_members);
  }
  if (description) {
    sql += 'description = ?, ';
    updatedData.push(description);
  }
  if (image) {
    sql += 'image_path = ?, ';
    updatedData.push(image);
  }
  
  // Remove the trailing comma and add the WHERE clause
  sql = sql.slice(0, -2); // Remove trailing comma and space
  sql += ' WHERE property_id = ?';
  updatedData.push(propertyId);

  con.query(sql, updatedData, (err, result) => {
    if (err) {
      console.error('Error updating property:', err);
      return res.status(500).json({ error: 'Failed to update property.' });
    }
    res.status(200).json({ message: 'Property updated successfully.' });
  });
});


app.post('/submit-report', (req, res) => {
  const { user_id, report_type, report_text } = req.body;
  const reportData = {user_id, report_type, report_text,};
  con.query('INSERT INTO reports SET ?', reportData, (err, result) => {
    if (err) {
      console.error('Error inserting report into the database: ' + err);
      res.status(500).json({ error: 'Failed to submit report' });
    } else {
      res.status(201).json({ message: 'Report submitted successfully' });
    }
  });
});

app.get('/property/:property_id', (req, res) => {
  const propertyId = req.params.property_id;
  // Query the database to retrieve the property information based on property_id
  const sql = ` SELECT  p.*, l.contact_no FROM properties p INNER JOIN landlords l ON p.landlord_id = l.landlord_id WHERE p.property_id = ?`;  
  con.query(sql, [propertyId], (err, result) => {
    if (err) {
      console.error('Error fetching property:', err);
      return res.status(500).json({ error: 'Failed to fetch property.' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Property not found.' });
    }
    // Property data found, return it as JSON
    const property = result[0];
    res.json(property);
  });
});

app.post('/verify', (req, res) => {
  const { user_id, propertyId, passportNumber, usSinceDate } = req.body;
  if (!user_id || !propertyId || !passportNumber || !usSinceDate) {
    return res.status(400).json({ error: 'User ID, property ID, passport number, and US since date are required.' });
  }
  const insertQuery = 'INSERT INTO verification (user_id, property_id, passport_number, us_since_date) VALUES (?, ?, ?, ?)';
  con.query(insertQuery, [user_id, propertyId, passportNumber, usSinceDate], (err, result) => {
    if (err) {
      console.error('Error inserting verification data:', err);
      return res.status(500).json({ error: 'Failed to store verification data.' });
    }
    res.status(200).json({ message: 'Verification data stored successfully' });
  });
});


app.get('/seniorscontact', (req, res) => {
  const sql = `
    SELECT users.user_id, MAX(users.firstname) AS firstname, MAX(users.lastname) AS lastname, MAX(users.email) AS email, MAX(users.contact_no) AS contact_no, MAX(verification.us_since_date) AS us_since_date
    FROM users
    INNER JOIN verification ON users.user_id = verification.user_id
    GROUP BY users.user_id
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching seniors contact data:', err);
      return res.status(500).json({ error: 'Failed to fetch data.' });
    }
    res.json(result);
  });
});

app.post('/pay', (req, res) => {
  const { user_id, propertyId, paymentMethod, paymentData } = req.body;
  if (!user_id || !propertyId || !paymentMethod) {
    return res.status(400).json({ error: 'User ID, property ID, and payment method are required.' });
  }
  const paymentStatus = 'Not Paid';
  const insertQuery = 'INSERT INTO billpayment (user_id, property_id, payment_method, payment_data, payment_status) VALUES (?, ?, ?, ?, ?)';
  con.query(insertQuery, [user_id, propertyId, paymentMethod, JSON.stringify(paymentData), paymentStatus], (err, result) => {
    if (err) {
      console.error('Error inserting payment data:', err);
      return res.status(500).json({ error: 'Failed to store payment data.' });
    }
    const updatePaymentStatusQuery = 'UPDATE billpayment SET payment_status = ? WHERE user_id = ? AND property_id = ?';
    con.query(updatePaymentStatusQuery, ['Paid', user_id, propertyId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating payment status:', updateErr);
        return res.status(500).json({ error: 'Failed to update payment status.' });
      }
      res.status(200).json({ message: 'Payment data stored and status updated successfully', paymentStatus: 'Paid' });
    });
  });
});


app.get('/billpayment/:propertyId/:userId', (req, res) => {
  const propertyId = req.params.propertyId;
  const userId = req.params.userId;
  const query = 'SELECT payment_method, payment_data, payment_status, payment_time FROM billpayment WHERE property_Id = ? AND user_Id = ?';
  con.query(query, [propertyId, userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (result.length > 0) {
      // If payment information is found, return it as a JSON response
      const paymentInfo = {
        paymentMethod: result[0].payment_method,
        paymentData: result[0].payment_data,
        paymentStatus: result[0].payment_status,
        paymentTime: result[0].payment_time,
      };
      res.json(paymentInfo);
    } else {
      // If no payment information is found, return an appropriate response (e.g., not found)
      res.status(404).json({ error: 'Payment information not found' });
    }
  });
});


app.post('/notifyLandlord', (req, res) => {
  const { senderId, recipientId, message } = req.body;
  if (!senderId || !recipientId || !message) {
    return res.status(400).json({ error: 'Sender ID, recipient ID, and message are required.' });
  }
  // Assuming you have a 'notifications' table with fields: notification_id, sender_id, recipient_id, message, notification_time
  const insertQuery = 'INSERT INTO notifications (sender_id, recipient_id, message, notification_time) VALUES (?, ?, ?, NOW())';

  con.query(insertQuery, [senderId, recipientId, message], (err, result) => {
    if (err) {
      console.error('Error inserting notification data:', err);
      return res.status(500).json({ error: 'Failed to store notification.' });
    }
    res.status(200).json({ message: 'Notification sent successfully' });
  });
});

// Handle GET requests to retrieve landlord notifications
app.get('/notifications/:recipientId', (req, res) => {
  const recipientId = req.params.recipientId;
  const selectQuery = 'SELECT * FROM notifications WHERE recipient_id = ? ORDER BY notification_time DESC';
  con.query(selectQuery, [recipientId], (err, results) => {
    if (err) {
      console.error('Error retrieving notifications:', err);
      return res.status(500).json({ error: 'Failed to retrieve notifications.' });
    }

    res.status(200).json(results);
  });
});

app.get('/getproblem',(req,res)=>{
  const sql="SELECT * FROM problems";
  con.query(sql,(err,result)=>{
      if(err) return res,json({Error:"Got an error in the sql"});
      return res.json({Status:"Success",Result:result})

  })
})

app.post('/addproblem', (req, res) => {
  // SQL query to insert new course details into the database
  const sql = "INSERT INTO problems (`name`, `email`, `location`, `problem`, `solution`) VALUES (?)";
  
  // Values extracted from the incoming request
  const values = [
      req.body.name,
      req.body.email,
      req.body.location,
      req.body.problem,
      req.body.solution,
  ];
  
  // Execute the query
  con.query(sql, [values], (err, data) => {
      // Error handling for the query
      if(err) {
          console.error("Error occurred during query execution:", err); // log the detailed error
          return res.status(500).json({status: 'Error', message: 'Unable to add problem to the database.'});
      }

      // Return a success response if course details were inserted successfully
      return res.status(200).json({status: 'Success', message: 'problem added successfully.', data: data});
  });
});



app.put('/updatesolution/:id', (req, res) => {
  const { id } = req.params;
  const { solution } = req.body;

  if (!id || !solution) {
      return res.status(400).json({ success: false, message: 'ID and solution are required.' });
  }

  const sql = "UPDATE problems SET solution = ? WHERE id = ?";

  con.query(sql, [solution, id], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Application not found.' });
      }

      res.status(200).json({ success: true, message: 'Solution updated successfully.' });
  });
});

app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM users WHERE user_id = ?';

  con.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user details from the database:', error);
      res.status(500).json({ error: 'Database error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const user = results[0];
      res.json(user);
    }
  });
});

app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;  
  const user = req.body;
  const query = 'UPDATE users SET ? WHERE user_id = ?';

  con.query(query, [user, userId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ Status: 'Error', Message: 'Database error' });
    } else {
      res.json({ Status: 'Success' });
    }
  });
});
