import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import newBlogForm from './components/NewBlog'

import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [warning, setWarning] = useState({type: null, message: null})

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
    setWarning({type:'info',message:'User logged out'})
      setTimeout(() => {
        setWarning({type:null,message:null})
      }, 5000)
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
      setWarning({type:'info',message:'User logged in'})
      setTimeout(() => {
        setWarning({type:null,message:null})
      }, 5000)
    } catch (exception) {
      setWarning({type:'error',message:'Wrong credentials'})
      setTimeout(() => {
        setWarning({type:null,message:null})
      }, 5000)
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    console.log(event.target.author.value)
    console.log(event.target.url.value)
    console.log(event.target.title.value)   

    if (!event.target.author.value || !event.target.url.value || !event.target.title.value) {
      setWarning({type:'error',message:'Missing details for new blog'})
      setTimeout(() => {
        setWarning({type:null,message:null})
      }, 5000)
      return
    }

    const blogObject = {
      author: event.target.author.value,
      url: event.target.url.value,
      title: event.target.title.value
    }

    const returnedBlog = await blogService.create(blogObject)
    if (returnedBlog) {
      setBlogs(blogs.concat(returnedBlog))
      event.target.reset()
    }
    else {
      setWarning({type:'error',message:'Could not add new blog'})
      setTimeout(() => {
        setWarning({type:null,message:null})
      }, 5000)
    }

  }

  return (
    <div>
      <Notification type={warning.type} message={warning.message} />
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}> logout </button></p>
          <NewBlogForm handleSubmit={handleNewBlog} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App