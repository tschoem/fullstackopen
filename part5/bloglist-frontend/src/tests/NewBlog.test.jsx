import { render, screen } from '@testing-library/react'
import NewBlogForm from '../components/NewBlog'
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

test('createBlog handler called with proper details', async () => {

  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<NewBlogForm createBlog={createBlog} />)


  const titleInput = screen.getByRole('textbox',{ name: 'title-input' })
  const authorInput = screen.getByRole('textbox',{ name: 'author-input' })
  const urlInput = screen.getByRole('textbox',{ name: 'url-input' })

  await user.type(titleInput, testBlog.title)
  await user.type(authorInput, testBlog.author)
  await user.type(urlInput, testBlog.url)

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe(testBlog.author)
  expect(createBlog.mock.calls[0][0].url).toBe(testBlog.url)
  expect(createBlog.mock.calls[0][0].title).toBe(testBlog.title)

})