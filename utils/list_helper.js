const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => blogs.reduce(((s,i) => s+i.likes), 0)

const favoriteBlog = (blogs) => 
  blogs.length !== 0 
    ? blogs.reduce(((j, k) => j.likes > k.likes ? j : k), blogs[0])
    : null

const mostBlogs = (blogs) => {
  const bloggers = [...new Set(blogs.map(b => b.author))]
  const countNames = (name) => blogs.filter(b => b.author === name).length
  return (
    bloggers[0]
      ? bloggers.map(b => {
          return { author: b, blogs: countNames(b) }
        }).toSorted((a, b) => b.blogs - a.blogs)[0]
      : null
  )
}

const mostLikes = (blogs) => {
  const bloggers = [...new Set(blogs.map(b => b.author))]
  const bloggersLikes = (name) => 
    blogs.filter(b => b.author === name).reduce(((t, c) => t + c.likes), 0)
  return (
    bloggers[0]
    ? bloggers.map(b => {
        return { author: b, likes: bloggersLikes(b) }
      }).toSorted((a, b) => b.likes - a.likes)[0]
    : null
  )
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
