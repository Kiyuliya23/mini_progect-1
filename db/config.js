import { MongoClient } from "mongodb";
import "dotenv/config";


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri); //ПРОВОДНИК К БАЗЕ ДАННЫ

let dbConnection = null;

// Для подключения к БАЗЕ ДАННЫХ 
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected succesfully to MongoDb");
        dbConnection = client.db();
    } catch (error) {
        console.error("Faild to connect to MongoDB");
        throw error;
    }
}

function getDb(){
    if(!dbConnection){
        throw new Error("Database not connected!");

    }
    return dbConnection;
}
connectToDatabase();

export { connectToDatabase, getDb };



