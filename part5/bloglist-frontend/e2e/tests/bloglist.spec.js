import { test, expect } from '@playwright/test';
import { loginWith, createBlog, randomString, getIndex } from './helper'

test.describe('Blog app', () => {
  test.beforeAll(async ({ request }) => {
    // Comment the reset command for parallel testing
    // To Prevent tests from deleting items while others are being executed
    //await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Thomas Schoemaecker',
        username: 'tom',
        password: 'password'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Arnold Second',
        username: 'arnold',
        password: 'second'
      }
    })
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tom', 'password')
      await expect(page.getByText('Thomas Schoemaecker logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tom', 'wrong password')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Thomas Schoemaecker logged in')).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, "tom", "password")
      await expect(page.getByText('Thomas Schoemaecker logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      const testId = randomString(10)

      await createBlog(page, `React patterns ${testId}`, 'Michael Chan', 'https://reactpatterns.com/')

      await expect(page.locator('.blog-summary').getByText(`React patterns ${testId} Michael Chan`)).toBeVisible()
    })

    test('a new blog can be expanded and edited', async ({ page }) => {
      const testId = randomString(10)

      await createBlog(page, `React patterns ${testId}`, 'Michael Chan', 'https://reactpatterns.com/')

      // blog can be expanded with show button
      await expect(page.locator('.blog-summary').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'show' })).toBeVisible()
      await page.locator('.blog-summary').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('link', { name: 'https://reactpatterns.com/' })).toBeVisible()

      // like button edits the entry and increments the likes
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'like' })).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByText('likes: 1')).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByText('likes: 2')).toBeVisible()

    })

    test('a new blog can be deleted', async ({ page }) => {
      const testId = randomString(10)

      await createBlog(page, `React patterns ${testId}`, 'Michael Chan', 'https://reactpatterns.com/')

      // remove the blog
      await page.locator('.blog-summary').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'remove' })).toBeVisible()
      page.on('dialog', dialog => dialog.accept())
      await page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'remove' }).click()

      // make sure the removal confirmation appears and the blog is no longer in the list
      await expect(page.locator('.info').getByText(`Blog deleted: React patterns ${testId} by Michael Chan`)).toBeVisible()
      await expect(page.getByText(`React patterns ${testId} Michael Chan`)).not.toBeVisible()
    })

    test('only the user who creates the blog can see the remove button', async ({ page }) => {
      const testId = randomString(10)

      // create a blog entry with initial user
      await createBlog(page, `React patterns ${testId}`, 'Michael Chan', 'https://reactpatterns.com/')

      // remove button is visible using the initial user 
      await page.locator('.blog-summary').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'remove' })).toBeVisible()

      // log out and log in with the second user
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, "arnold", "second")
      await expect(page.getByText('Arnold Second logged in')).toBeVisible()

      // remove button is no longer visible
      await page.locator('.blog-summary').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are arranged in the order according to the likes', async ({ page }) => {
      const testId = randomString(10)

      await createBlog(page, `React patterns ${testId}`, 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, `Canonical string reduction ${testId}`, 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      // make sure both blogs are visible
      await expect(page.locator('.blog-summary').filter({ hasText: `React patterns ${testId} Michael Chan` })).toBeVisible()
      await expect(page.locator('.blog-summary').filter({ hasText: `Canonical string reduction ${testId}` })).toBeVisible()

      // look for the blog indexes
      let rows = await page.locator('.blog-summary')
      let indexReact = await getIndex(rows, `React patterns ${testId} Michael Chan`)
      let indexCanonical = await getIndex(rows, `Canonical string reduction ${testId}`)

      // blogs initially displayed in creation order
      expect(indexReact).toBeLessThan(indexCanonical)

      // expand both to show the like buttons
      await page.locator('.blog-summary').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'show' }).click()
      await page.locator('.blog-summary').filter({ hasText: `Canonical string reduction ${testId}` }).getByRole('button', { name: 'show' }).click()

      // click twice on the second blog's like button. it moves above in the list
      await page.locator('.blog-details').filter({ hasText: `Canonical string reduction ${testId}` }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `Canonical string reduction ${testId}` }).getByText('likes: 1')).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: `Canonical string reduction ${testId}` }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `Canonical string reduction ${testId}` }).getByText('likes: 2')).toBeVisible()

      // check the new indexes
      rows = await page.locator('.blog-details')
      indexReact = await getIndex(rows, `React patterns ${testId} Michael Chan`)
      indexCanonical = await getIndex(rows, `Canonical string reduction ${testId}`)
      // Canonical blog should be above 
      expect(indexReact).toBeGreaterThan(indexCanonical)

      // click 3 times on the first blog's like button. it moves back to the first position 
      await page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByText('likes: 1')).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByText('likes: 2')).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: `React patterns ${testId} Michael Chan` }).getByText('likes: 3')).toBeVisible()
      await expect(page.locator('.blog-details').first()).toContainText(`React patterns ${testId} Michael Chan`)

      // check the new indexes
      rows = await page.locator('.blog-details')
      indexReact = await getIndex(rows, `React patterns ${testId} Michael Chan`)
      indexCanonical = await getIndex(rows, `Canonical string reduction ${testId}`)
      // React blog should be above 
      expect(indexReact).toBeLessThan(indexCanonical)

    })

  })

})