const { SHA256 } = require('crypto-js');

const { readData } = require('../commond/readData');
const { PersistData } = require('../drivers/driver');

async function dataMatches() {
    const persistData = new PersistData();
    const userArray = readData();
    const actualHash = SHA256(JSON.stringify(userArray)).toString();
    const userArrayPeristed = await persistData.read({ collectionName: "users", attributes: { _id: 0 } });
    const persistHash = SHA256(JSON.stringify(userArrayPeristed)).toString();
    console.log("Data matches->", (actualHash == persistHash));
}

async function incompleteUsers() {
    const persistData = new PersistData();
    let userArrayPeristed = await persistData.read({ collectionName: "users", filters: { email_address: "", consent: "Y" }, attributes: { _id: 1 } });
    console.log("users with no email ->", userArrayPeristed);
    userArrayPeristed = await persistData.read({ collectionName: "users", filters: { first_name: "" }, attributes: { _id: 1 } });
    console.log("users with no name ->", userArrayPeristed);
}

async function emailValidation() {
    let persistData = new PersistData();
    const emailsArrayPeristed = await persistData.read({ collectionName: "schedules" });

    if (emailsArrayPeristed.length == 0) {
        throw new Error('no emails found');
    }
    persistData = new PersistData();
    const userArrayPeristed = await persistData.read({ collectionName: "users", filters: { email_address: { $ne: "" }, consent: "Y" } });

    emailsArrayPeristed.forEach(email => {
        const union = userArrayPeristed.find(user => {
            return user._id.toString() == email.idUser.toString();
        });
        
        if (!union) {
            throw new Error('no emails bad scheduled');
        }
    });
    console.log('every emails ok');
}

(() => {
    try {
        dataMatches();
        incompleteUsers();
        emailValidation();
    } catch (error) {
        console.log(error);
    }
})()