import { render } from '@testing-library/react'
import Blog from '../components/Blog'

test('renders author, title but not url nor likes', () => {
  const blog = {
    author: 'Blog Author',
    title: 'Blog title',
    url: 'https://blogurl.com',
    likes: 20,
    user: {
      name: 'user full name',
      username: 'username'
    }
  }
  const user = {
    name: 'logged in full name',
    username: 'logged in username'
  }
  const incrementLikes = vi.fn()
  const deleteBlog = vi.fn()

  const { container } = render(<Blog blog={blog} user={user} incrementLikes={incrementLikes} deleteBlog={deleteBlog} />)

  const div = container.querySelector('.blog-summary')

  //screen.debug(div)

  expect(div).toHaveTextContent(
    blog.author
  )

  expect(div).toHaveTextContent(
    blog.title
  )

  expect(div).not.toHaveTextContent(
    blog.url
  )

  expect(div).not.toHaveTextContent(
    blog.likes
  )

})
