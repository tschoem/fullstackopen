import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import userEvent from '@testing-library/user-event'

const testBlog = {
  author: 'Blog Author',
  title: 'Blog title',
  url: 'https://blogurl.com',
  likes: 20,
  user: {
    name: 'user full name',
    username: 'username'
  }
}

const testUser = {
  name: 'logged in full name',
  username: 'logged in username'
}

test('renders author, title but not url nor likes', () => {

  const incrementLikes = vi.fn()
  const deleteBlog = vi.fn()

  const { container } = render(<Blog blog={testBlog} user={testUser} incrementLikes={incrementLikes} deleteBlog={deleteBlog} />)

  const div = container.querySelector('.blog-summary')

  //screen.debug(div)

  expect(div).toHaveTextContent(
    testBlog.author
  )

  expect(div).toHaveTextContent(
    testBlog.title
  )

  expect(div).not.toHaveTextContent(
    testBlog.url
  )

  expect(div).not.toHaveTextContent(
    testBlog.likes
  ) 

})

test('renders url and likes after show button is clicked', async () => {
  
  const incrementLikes = vi.fn()
  const deleteBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<Blog blog={testBlog} user={testUser} incrementLikes={incrementLikes} deleteBlog={deleteBlog} />)

  const showButton = screen.getByText('show')
  await user.click(showButton)

  const div = container.querySelector('.blog-details')

  expect(div).toHaveTextContent(
    testBlog.author
  )

  expect(div).toHaveTextContent(
    testBlog.title
  )

  expect(div).toHaveTextContent(
    testBlog.url
  )

  expect(div).toHaveTextContent(
    testBlog.likes
  )
})