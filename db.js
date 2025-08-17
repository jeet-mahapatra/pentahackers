const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/PentaHacker";

const connectToMongo = async ()=>{
    try {
        await mongoose.connect(mongoURL);
        console.log("✅ Connected to MongoDB successfully")
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1); // Exit app on error
    }
    
}

module.exports = connectToMongo;