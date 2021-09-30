const { MongoClient } = require('mongodb');
const { SHA256, MD5 } = require('crypto-js')

function PersistData() {
    // Connection URL
    const dbName = "humanCare";
    const url = 'mongodb://localhost:27017';
    var client;
    const connection = async () => {
        client = new MongoClient(url);
        await client.connect();
        return client.db(dbName);
    }
    const close = () => {
        client.close();
    }
    this.create = async ({ collectionName, dataArray }) => {
        const db = await connection();
        const collection = db.collection(collectionName);
        const saved = await collection.insertMany(dataArray);
        close();
    }
    this.read = async ({ collectionName, attributes = {}, filters = {} }) => {
        const db = await connection();
        const collection = db.collection(collectionName);
        const result = await collection.find(filters, { projection: attributes }).toArray();
        close();
        return result;
    }
}

module.exports = { PersistData };