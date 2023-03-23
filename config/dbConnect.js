const mongosoe = require('mongoose');


const connectDB = async () => {

    try {
        
        const conn = await mongosoe.connect(process.env.MONGO_URI);

        if(conn) {

            console.log('connection to mongoDB successful...');

        } else {

            console.log('Something went wrong. Please try again.');
        }

    } catch (error) {
        
        console.log(error);

    };

};


module.exports = {
    connectDB
}

