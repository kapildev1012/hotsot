import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect('mongodb+srv://kapildev16june:kapildev16june@cluster0.sem9x.mongodb.net/food-del', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ DB Connected Successfully");
    } catch (error) {
        console.error("❌ Error connecting to DB:", error);
        process.exit(1); // Exit the process if connection fails
    }
};

// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.