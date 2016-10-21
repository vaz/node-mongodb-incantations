/*
 * We know how this one works. Regular node async callbacks.
 *
 * Maybe the most interesting thing here is
 * `if (err) return console.error(err.stack)`
 * which is about as close as you can get to
 * something like Promise-style `catch`
 * (aka `fail` in jQuery's promises).
 *
 * It could be refactored with more intermediate functions
 * and it would look cleaner, but it's still callback hell.
 *
 */

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/organizer', (err, db) => {
  console.log('connected')

  const notes = db.collection('notes')

  const cleanup = () => {
    console.log('closing db connection')
    db.close()
  }

  const handleError = (err) => {
    console.error(err.stack)
    cleanup()
  }

  notes.count((err, count) => {
    // returning this, even though it's undefined, for
    // the purpose of control flow (stop processing here)
    if (err) return handleError(err)

    console.log('count is:', count)

    notes.insert({ message: 'hi', value: 345 }, (err, result) => {
      if (err) return handleError(err)
      console.log('insert result: ', result.result)

      notes.count((err, count) => {
        if (err) return handleError(err)
        console.log('count is:', count)

        cleanup()
      })
    })
  })
})
