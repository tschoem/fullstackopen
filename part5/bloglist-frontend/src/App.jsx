import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlog'
import Togglable from './components/Togglable'
import './index.css'

import blogService from './services/blogs'
import loginService from './services/login'

const NOTIFICATION_TIMEOUT = 5000

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [warning, setWarning] = useState({ type: null, message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>login to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setWarning({ type: 'info', message: 'User logged out' })
    setTimeout(() => {
      setWarning({ type: null, message: null })
    }, NOTIFICATION_TIMEOUT)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setWarning({ type: 'info', message: 'User logged in' })
      setTimeout(() => {
        setWarning({ type: null, message: null })
      }, NOTIFICATION_TIMEOUT)
    } catch (exception) {
      setWarning({ type: 'error', message: 'Wrong credentials' })
      setTimeout(() => {
        setWarning({ type: null, message: null })
      }, NOTIFICATION_TIMEOUT)
    }
  }

  const createBlog = async (blogObject) => {

    if (!blogObject.author || !blogObject.url || !blogObject.title) {
      setWarning({ type: 'error', message: 'Missing details for new blog' })
      setTimeout(() => {
        setWarning({ type: null, message: null })
      }, NOTIFICATION_TIMEOUT)
      return null
    }

    const returnedBlog = await blogService.create(blogObject)
    if (returnedBlog) {
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setWarning({ type: 'info', message: `a new blog ${blogObject.title} by ${blogObject.author} added` })
      setTimeout(() => {
        setWarning({ type: null, message: null })
      }, NOTIFICATION_TIMEOUT)
    }
    else {
      setWarning({ type: 'error', message: 'Could not add new blog' })
      setTimeout(() => {
        setWarning({ type: null, message: null })
      }, NOTIFICATION_TIMEOUT)
    }

    return returnedBlog

  }

  return (
    <div>
      <Notification type={warning.type} message={warning.message} />
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}> logout </button></p>
          <Togglable buttonLabel="new note" ref={blogFormRef}>
            <NewBlogForm createBlog={createBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App