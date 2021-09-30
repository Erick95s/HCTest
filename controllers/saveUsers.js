const { PersistData } = require('../drivers/driver');
const { readData } = require('../commond/readData');

(async () => {
    try {
        const persistData = new PersistData();
        const userArray = readData();
        await persistData.create({ collectionName: "users", dataArray: userArray });
        console.log('users save');
    } catch (error) {
        console.log(error)
    }
})()