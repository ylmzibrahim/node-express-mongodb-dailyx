const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API is running'));

// Define Routes
app.use('/api/articles', require('./routes/api/articles'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/default', require('./routes/api/default'));
app.use('/api/favorites', require('./routes/api/favorites'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/users', require('./routes/api/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
