import mongoose  from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Successful Connection Established to MongoDB`)
        
    } catch (err) {
        console.log("Error connecting to MongoDB\n",err);
        process.exit(1);   
    }
}

export default connectDb;