const { Router } = require("express")
const usersRoutes = require("./user.routes")
const notesRoutes = require("./notes.routes")
const tagsRoutes = require("./tags.routes")
const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/movieNotes", notesRoutes)
routes.use("/movieTags", tagsRoutes)

module.exports = routes