import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ createBlog }) => {
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const returnedBlog = await createBlog({
      author: newAuthor,
      url: newUrl,
      title: newTitle
    })
    
    if (returnedBlog) {
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    }
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog} >
        <div>
          title
          <input
            type="text"
            name="title"
            aria-label="title-input"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            aria-label="author-input"
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            name="url"
            aria-label="url-input"
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
          />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default NewBlogForm