import { useState } from 'react'

const Blog = ({ blog }) => {
  const [detailedView, setDetailedView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleView = async (event) => {
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
      {blog.url}<br />
      likes: {blog.likes} <button>like</button><br />
      {blog.user.name}
    </>
  )

  const renderBlog = () => {
    console.log(blog)
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