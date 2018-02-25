const User = require('../models/user')
const { format, initialNotes, nonExistingId, notesInDb, usersInDb } = require('./test_helper')

const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

describe.only('when there is initially one user at db', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'testikayttaja',
      name: 'Testi Käyttäjä',
      password: 'salainen',
      adult: true
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
  const usersBeforeOperation = await usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
    adult: true
    }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body).toEqual({ error: 'username must be unique'})
  const usersAfterOperation = await usersInDb()
  expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users fails with proper statuscode and message if password is uner 4 characters', async () => {
  const usersBeforeOperation = await usersInDb()

  const newUser = {
    username: 'eisalasanaa',
    name: 'salasanaton',
    adult: true
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body).toEqual({ error: 'password must be longer than 3 characters'})
  const usersAfterOperation = await usersInDb()
  expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users sets adult as "true" if not defined', async () => {
  const usersBeforeOperation = await usersInDb()

  const newUser = {
    username: 'aikuinen',
    name: 'Aikuisuus määrittelemätön',
    password: 'zalazana'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAfterOperation = await usersInDb()
  expect(usersAfterOperation[usersAfterOperation.length - 1].adult).toBe(true)
  expect(usersAfterOperation.length).toBe(usersBeforeOperation.length +1)
  })

})