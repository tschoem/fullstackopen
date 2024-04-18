import { test, expect } from '@playwright/test'
import { loginWith, createNote } from './helper'

test.describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')

    await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright', true)
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    test.describe('and several notes exist', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
        await createNote(page, 'third note', true)
      })

      test('importance can be changed', async ({ page }) => {
        const otherNoteText = await page.getByText('second note')
        const otherdNoteElement = await otherNoteText.locator('..')

        await otherdNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherdNoteElement.getByText('make important')).toBeVisible()
      })
    })

  })
})