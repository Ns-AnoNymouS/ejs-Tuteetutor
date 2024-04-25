const db = require('./db')

class Admin{
    async fetchCollections(){
        const collections = await db.getCollections();
        return collections;
    }
}
module.exports = new Admin()