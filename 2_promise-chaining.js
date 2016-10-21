/*
 * Promises. We saw them in jQuery with
 * `$.ajax(...).then(successCallback).fail(errorCallback)`.
 *
 * We have them in Node, too, but they're a bit different.
 * `catch` instead of `fail` is the only one you'd notice
 * at this point.
 *
 * You can't just use promise-style on any function that
 * can take a callback. They have to support it explicitly.
 * The `mongodb` package does, as do many other 3rd-party
 * libraries, like `request` for example.
 *
 * (Node standard library functions like in `fs` and `streams`
 * do not, however.)
 *
 * You'll learn promises in more depth soon, but it should
 * be easy enough to adapt callback style to promise style
 * even without fully understanding it.
 *
 * My conclusion on this style: still fairly awkward tbh,
 * but it's not callback hell, and error handling is much
 * easier with a single catch at the end.
 */
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/organizer', (err, db) => {
  console.log('connected')

  const notes = db.collection('notes')

  const cleanup = () => {
    console.log('closing db connection')
    db.close()
  }

  // Starting off with `Promise.resolve()` is actually
  // pretty peculiar. Most people wouldn't do it, but I
  // really like how it lines everything up. Otherwise you'd
  // have:
  //
  //     notes.count()
  //       .then(count => console.log(...))
  //
  //       .then(() => notes.insert(...))
  //       .then(result => console.log(...))
  //
  //       ...
  //
  // The lack of symmetry bugs me. `Promise.resolve()`
  // creates a new Promise that's immediately successful
  // and passes its argument (`undefined` because I didn't
  // pass one) to the next success callback.
  //
  Promise.resolve()
    .then(() => notes.count())
    .then(count => console.log('count is:', count))

    .then(() => notes.insert({ message: 'hi', value: 345 }))
    .then(result => console.log('insert result: ', result.result))

    .then(() => notes.count())
    .then(count => console.log('count is:', count))

    .catch(console.error)
    .then(cleanup)
})
