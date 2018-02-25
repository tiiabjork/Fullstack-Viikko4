const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { formatBlog, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(blogObjects.map(b => b.save()))
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedTitles = response.body.map(b => b.title)
    blogsInDatabase.forEach(blog => {
      expect(returnedTitles).toContain(blog.title)
    })
  })

  test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
    const blogsInDatabase = await blogsInDb()
    const aBlog = blogsInDatabase[0]

    const response = await api
      .get(`/api/blogs/${aBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.title).toBe(aBlog.title)
  })

  /* test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
    const invalidId= "5a3d5tb59070081a82a3445"

    const response = await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  }) */

  describe('addition of a new blog', async () => {

    test('POST /api/blogs succeeeds with valid data', async () => {
      const blogsAtStart = await blogsInDb()

      const newBlog = {
        title: "Colour me!",
        author: "Iia",
        url: "https://colourme.blogspot.com",
        likes: 55
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

      const titles = blogsAfterOperation.map(b => b.title)
      expect(titles).toContain('Colour me!')
    })

    test('a blog without likes gets the value of 0', async () => {
      const newBlog = {
        title: "Blogi ilman tykkäyksiä",
        author: "Matti Nykänen",
        url: "https://kivablogi.fi"
      }

      const blogsAtStart = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(b => b.title)
      const likes = blogsAfterOperation.map(b => b.likes)

      expect(titles).toContain('Blogi ilman tykkäyksiä')
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      expect(likes[likes.length - 1]).toBe(0)
    })


    test('POST /api/blogs fails with proper statuscode if title and url are missing', async () => {
      const newBlog = {
        author: "Hevonen",
        likes: 123
      }

      const blogsAtStart = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
  })

  describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
      addedBlog = new Blog({
        title: 'Poistettava blogi',
        author: 'Minä',
        url: 'www.poistaminut.com',
        likes: 0
      })
      await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(b => b.title)

      expect(titles).not.toContain(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
  })

  afterAll(() => {
    server.close()
  })
})
