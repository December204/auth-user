const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const app = express();
const authRoute = require('./routes/auth.route.js');
const userRoute = require('./routes/users.route.js');
const cookieParser = require('cookie-parser');
const {protectedRoute} = require('./middlewares/authmiddlewares.js');
app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));


app.use('/api/auth',authRoute)
app.use('api/signin',authRoute)
app.use('api/signout',authRoute)
app.use(protectedRoute);
app.use('/api/users',userRoute);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});