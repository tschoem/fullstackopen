import { test, expect } from '@playwright/test';
import { loginWith, createBlog } from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
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
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, "tom", "password")
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      await expect(page.locator('.blog-summary').getByText("React patterns")).toBeVisible()
      await expect(page.locator('.blog-summary').getByText("Michael Chan")).toBeVisible()
    })

    test('a new blog can be expanded and edited', async ({ page }) => {
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      // blog can be expanded with show button
      await expect(page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' })).toBeVisible()
      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('link', { name: 'https://reactpatterns.com/' })).toBeVisible()

      // like button edits the entry and increments the likes
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' })).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' }).click()
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByText('likes: 2')).toBeVisible()

    })

    test('a new blog can be deleted', async ({ page }) => {
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      // remove the blog
      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' })).toBeVisible()
      page.on('dialog', dialog => dialog.accept())
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' }).click()

      // make sure the removal confirmation appears and the blog is no longer in the list
      await expect(page.locator('.info').getByText('Blog deleted: React patterns')).toBeVisible()
      await expect(page.getByText('React patterns Michael Chan')).not.toBeVisible()
    })

    test('only the user who creates the blog can see the remove button', async ({ page }) => {
      // create two blog entries with initial user
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      // remove button is visible using the initial user 
      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' })).toBeVisible()

      // log out and log in with the second user
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, "arnold", "second")

      // remove button is no longer visible
      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are arranged in the order according to the likes', async ({ page }) => {
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      // blogs initially displayed in creation order
      await expect(page.locator('.blog-summary').first()).toContainText('React patterns Michael Chan')
      await expect(page.locator('.blog-summary').nth(1)).toContainText('Canonical string reduction')

      // expand both to show the like buttons
      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await page.locator('.blog-summary').filter({ hasText: 'Canonical string reduction' }).getByRole('button', { name: 'show' }).click()

      // click twice on the second blog's like button. it moves to the first place in the list
      await page.locator('.blog-details').filter({ hasText: 'Canonical string reduction' }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'Canonical string reduction' }).getByText('likes: 1')).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: 'Canonical string reduction' }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'Canonical string reduction' }).getByText('likes: 2')).toBeVisible()
      await expect(page.locator('.blog-details').first()).toContainText('Canonical string reduction')

      // click 3 times on the first blog's like button. it moves back to the first position 
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByText('likes: 1')).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByText('likes: 2')).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByText('likes: 3')).toBeVisible()
      await expect(page.locator('.blog-details').first()).toContainText('React patterns Michael Chan')

    })

  })

})