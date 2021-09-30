const { PersistData } = require('../drivers/driver');

const numberEmails = 4;

async function shceduleEmails() {
    let persistData = new PersistData();
    let userArrayPeristed = await persistData.read({ collectionName: "users", filters: { email_address: { $ne: "" }, consent: "Y" } });
    const shcheduleEmails = [];

    if(userArrayPeristed.length == 0){
        return console.log('no users found');
    }

    userArrayPeristed.forEach(user => {
        const date = new Date();
        for (let index = 0; index < numberEmails; index++) {
            shcheduleEmails.push({
                name: `Day ${index + 1}`,
                scheduled_date: new Date(date.setDate(date.getDate() + index + 1)),
                idUser: user._id
            })
        }
    });
    persistData = new PersistData();
    await persistData.create({ collectionName: "schedules", dataArray: shcheduleEmails });
    console.log("emails saved");
}

(()=>{
    try {
        shceduleEmails();
    } catch (error) {
        console.log(error);
    }
})()