/*
 * Coroutines... AKA Generators
 *
 * This way is probably pretty unfamiliar to many
 * seasoned web devs. It's new ES6 stuff.
 *
 * ES6 generators are functions, except they're
 * defined with `function*` instead of `function`.
 * They also `yield` instead of `return` things.
 * Unlike regular functions, they can `yield`
 * over and over. Later, the generator can be
 * re-invoked and pick up where it left off,
 * and the yield statement can also produce a value
 * that's passed in from outside.
 *
 * Details on MDN:
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*
 *
 * Typically they're used to produce iteration values
 * one at a time. But the `co` module uses them in
 * an interesting way: you can `yield` promises whenever
 * you want to suspend execution until the promise
 * resolves.
 *
 * The result of this really cleans up and straightens
 * out async code. Have a look. Don't worry if it
 * seems bizarre, you don't need to understand it,
 * or even use it, unless you feel like it.
 * This is just kind of a "bonus" version (though
 * it's actually based directly on the official
 * mongodb docs).
 *
 * (It's only really worth it if you have to sequence
 * a bunch of async things.)
 */
const MongoClient = require('mongodb').MongoClient;
const co = require('co')

let cleanup // so we can call it in catch() below

co(function* () {
  const db = yield MongoClient.connect('mongodb://localhost:27017/organizer')
  console.log('connected')

  const notes = db.collection('notes')

  cleanup = () => {
    console.log('closing db connection')
    db.close()
  }

  let count = yield notes.count()
  console.log('count is:', count)

  let result = yield notes.insert({ message: 'co is neat', value: 4 })
  console.log('insert result:', result.result)

  count = yield notes.count()
  console.log('count is:', count)

  cleanup()

}).catch(err => {
  console.error(err)
  cleanup()
})

