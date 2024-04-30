const db = require('./db')

class Admin{
    async fetchCollections(){
        const collections = await db.getCollections();
        return collections;
    }

    async fetchAttributes(collection){
        const keys = await db.getAttributes(collection);
        return keys;
    }

    async fetchData(collection){
        const data = await db.getData(collection);
        return data;
    }
}
module.exports = new Admin()