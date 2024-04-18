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

      await expect(page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' })).toBeVisible()
      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('link', { name: 'https://reactpatterns.com/' })).toBeVisible()

      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' })).toBeVisible()
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' }).click()
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByText('likes: 2')).toBeVisible()

    })

    test('a new blog can be deleted', async ({ page }) => {
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' })).toBeVisible()
      page.on('dialog', dialog => dialog.accept())
      await page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('.info').getByText('Blog deleted: React patterns')).toBeVisible()
      await expect(page.getByText('React patterns Michael Chan')).not.toBeVisible()
    })

    test('only the user who creates the blog can see the remove button', async ({ page }) => {
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, "arnold", "second")

      await page.locator('.blog-summary').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'show' }).click()
      await expect(page.locator('.blog-details').filter({ hasText: 'React patterns Michael Chan' }).getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

  })

})