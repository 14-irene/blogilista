const { test, describe } = require('node:test')
const assert = require('node:assert')
const { totalLikes, 
        favoriteBlog, 
        mostBlogs, 
        mostLikes,
        dummy} = require('../utils/list_helper')
const example_list = require('./example_list')

test('dummy returns one', () => {
  const blogs = []
  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

describe('favorite blog', () => {
  test('when list is empty is null', () => {
    assert.strictEqual(favoriteBlog([]), null)
  })
  test(`when list has one entry is \"${listWithOneBlog[0].title}\"`, () => {
    assert.strictEqual(favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })
  test(`when using example list is \"${example_list[2].title}\"`, () => {
    assert.strictEqual(favoriteBlog(example_list), example_list[2])
  })
})

describe('total likes', () => {
  const listWithSevenBlogsAndSevenLikesTotal = [
    {"_id":"67138e0d2dfe11e5d92d3fa5",
      "title":"blog1",
      "author":"ira",
      "url":"111",
      "likes":3,
      "__v":0},
    {"_id":"67139a531cbe6e9d69af98ca",
      "title":"blog2",
      "author":"ira",
      "url":"222",
      "likes":1,
      "__v":0},
    {"_id":"6713aa26218336affdb0a720",
      "title":"blog3",
      "author":"ira",
      "url":"333",
      "likes":0,
      "__v":0},
    {"_id":"6713aa5c0d9a1f47415c5dce",
      "title":"blog4",
      "author":"ira",
      "url":"444",
      "likes":1,
      "__v":0},
    {"_id":"6713ab514a04a0c5504ff2ae",
      "title":"blog5",
      "author":"ira",
      "url":"555",
      "likes":0,
      "__v":0},
    {"_id":"6713ab7fb79689fc7619fa9f",
      "title":"blog6",
      "author":"ira",
      "url":"666",
      "likes":0,
      "__v":0},
    {"_id":"6713abd2e6804aa59137ddc6",
      "title":"blog7",
      "author":"ira",
      "url":"777",
      "likes":2,
      "__v":0}
  ]


  test('when list has only one blog equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('when list is empty equals zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })
  test('when list has seven blogs with total of seven likes', () => {
    assert.strictEqual(totalLikes(listWithSevenBlogsAndSevenLikesTotal), 7)
  })
})

describe('most blogs', () => {
  test('when list is empty is null', () => {
    assert.strictEqual(mostBlogs([]), null)
  })
  test(`when list has one blog is \"${listWithOneBlog[0].author}\"`, () => {
    assert.strictEqual(mostBlogs(listWithOneBlog).author, listWithOneBlog[0].author)
  })
  test('when using example list is \"Robert C. Martin\"', () => {
    assert.strictEqual(mostBlogs(example_list).author, 'Robert C. Martin')
  })
})

describe('most likes', () => {
  test('when list is empty is null', () => {
    assert.strictEqual(mostLikes([]), null)
  })
  test(`when list has one blog is \"${listWithOneBlog[0].author}\"`, () => {
    assert.strictEqual(mostLikes(listWithOneBlog).author, listWithOneBlog[0].author)
  })
  test(`when using example list is \"${example_list[1].author}\"`, () => {
    assert.strictEqual(mostLikes(example_list).author, example_list[1].author)
  })
})

