const fs = require('fs');
const path = require('path');

const rowHeaders = 3;

function readData() {
    const filePath = path.join(__dirname, '../data.txt');
    let data = fs.readFileSync(filePath, 'utf8');

    data = data.split(/\r\n/gm);

    let headers = data.splice(0, rowHeaders);
    headers = headers.join(" ").toLowerCase();
    headers = headers.replace(/\s/g, '_');

    headers = headers.split('|');

    let dataR = [];

    for (let index = 0; index < data.length; index++) {
        if ((index) % 2 == 0) {
            dataR.push(data[index].concat(" ", data[index + 1]));
        }
    }

    return dataR.map((rawUser, index) => {
        const userObject = {};
        const rowUser = rawUser.split('|');
        rowUser.forEach((item, index) => {
            userObject[headers[index]] = item
        });
        return userObject;
    });
}

module.exports = { readData };