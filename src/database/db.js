import { MongoClient} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db(process.env.DATABASE_NAME);

export const connectDB = async() => {
  try {
    await mongoClient.connect()
  } catch (error) {
    console.log (error)
  }
}

export default db
