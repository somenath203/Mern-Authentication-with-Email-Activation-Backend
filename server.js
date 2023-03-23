require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { StatusCodes } = require('http-status-codes');

const { connectDB } = require('./config/dbConnect');

const userRouters = require('./routes/userRoutes');


connectDB();


const app = express();


app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {

    res.status(StatusCodes.OK).json({
        success: true,
        message: " 'authentication-with-email-verification-project' server is up and running successfully "
    });

});

app.use('/auth', userRouters);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
})