const sqliteConnection = require("../../sqlite")
const createUsers = require("./createUsers")

async function migrationsRuns(){
    const schems = [
        createUsers
    ].join('')

    sqliteConnection().then(db => db.exec(schems))
    .catch(error => console.error(error))
}

module.exports = migrationsRuns
