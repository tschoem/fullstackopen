import { useState } from 'react'

const Blog = ({ blog, user, incrementLikes, deleteBlog }) => {
  const [detailedView, setDetailedView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleView = () => {
    setDetailedView(!detailedView)
  }

  const showSummary = () => (
    <>
      {blog.title} {blog.author} <button onClick={toggleView}>show</button>
    </>
  )

  const showDetails = () => (
    <>
      {blog.title} {blog.author} <button onClick={toggleView}>hide</button><br />
      <a href={blog.url}>{blog.url}</a><br />
      likes: {blog.likes} <button onClick={incrementLikes}>like</button><br />
      {blog.user.name}<br />
      {blog.user.id === user.id &&
        <button style={{ backgroundColor: 'blue' }} onClick={deleteBlog}>remove</button>
      }
    </>
  )

  const renderBlog = () => {
    if (detailedView) {
      return showDetails()
    } else {
      return showSummary()
    }
  }
  return (
    <div style={blogStyle}>
      {renderBlog()}
    </div>
  )
}

export default Blog