import { expect } from '@playwright/test';

const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await expect(page.locator('//h2').getByText('create new')).toBeVisible()
  await page.getByTestId('title-input').fill(title)
  await page.getByTestId('author-input').fill(author)
  await page.getByTestId('url-input').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.locator('.blog-summary').getByText(title).waitFor()
}

const randomString = (length) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

const getIndex = async (rows, searchString) => {
  const count = await rows.count()
  for (let i = 0; i < count; ++i) {
    let rowContent = await rows.nth(i).textContent()
    if (rowContent.includes(searchString)) return i
  }
  return -1
}

export { loginWith, createBlog, randomString, getIndex }