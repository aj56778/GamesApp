import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://Arjun_Gupta:bathinda@cluster0.1degy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

export const uploadImage = async(user, type, image) => {
    const mongoServer = new MongoClient(uri);
    await mongoServer.connect();

    const dbName = 'User_Data';
    const collectionName = 'Media';

    const db = mongoServer.db(dbName);
    const collection = db.collection(collectionName);

    try {
        await collection.insertOne({
            userName: user,
            type: type,
            image: image
        })
        // console.log(insertImage)
    } catch (err) {
        console.log(err)
    }
    
}