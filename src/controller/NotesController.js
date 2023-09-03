const knex = require("../database/knex")

class NotesController {
  
    async create(req, res) {
        const {title, description, rating, tags} = req.body
        const {user_id} = req.params

        if (rating < 1 || rating > 5) {
          throw new appError('A nota deve variar entre 1 e 5');
        }

        const [note_id] = await knex("movieNotes").insert({
            title,
            description,
            rating,
            user_id
        })

    

        const tagsInsert = tags.map(name => {
            return {
              note_id,
              name,
              user_id
            }
          })
      
          await knex("movieTags").insert(tagsInsert)
      
          return res.json()
    }

    async show(req, res) {
      const { id } = req.params
      const note = await knex("movieNotes").where({ id }).first()
      const tags = await knex("movieTags").where({ note_id: id }).orderBy("name")
       
    
        return res.json({
          ...note,
          tags,
        })
      
    }

    async delete(req, res) {
      const {id} = req.params
      await knex("movieNotes").where({id}).delete()

      return res.json()

    }

    async index(req, res) {
      const { title, user_id, tags } = req.query
  
      let notes
  
      if (tags) {
        const filterTags = tags.split(',').map(tag => tag.trim())
  
        notes = await knex("movieTags").select(["movieNotes.id", "movieNotes.title", "movieNotes.user_id",])
          .where("movieNotes.user_id", user_id)
          .whereLike("movieNotes.title", `%${title}%`)
          .whereIn("name", filterTags)
          .innerJoin("movieNotes", "movieNotes.id", "movieTags.note_id")
          .orderBy("movieNotes.title")
          
      } else {
        notes = await knex("movieNotes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
      }
  
      const userTags = await knex("movieTags").where({ user_id })
      const notesWhithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)
  
        return {
          ...note,
          tags: noteTags
        }
      })
  
      return res.json(notesWhithTags)
    }
    
}

module.exports = NotesController