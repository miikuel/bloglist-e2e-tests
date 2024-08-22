const { test, describe, beforeEach, expect } = require('@playwright/test')

describe('Blog app', () => {

    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:5173/api/testing/reset')
        await request.post('http://localhost:5173/api/users', {
          data: {
            name: 'Teppo Testi',
            username: 'ttesti',
            password: 'salainen'
          }
        })
    
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown by default', async ({ page }) => {
      const locator = await page.getByRole('heading', { name: 'Login' })
      await expect(locator).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('ttesti')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('Teppo Testi logged in')).toBeVisible()
        })
    
        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('textbox').first().fill('ttesti')
            await page.getByRole('textbox').last().fill('väärä')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('Teppo Testi logged in')).not.toBeVisible()
        })
    })

    describe('when logged in', () => {
        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('textbox').first().fill('ttesti')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByRole('button', { name: 'new blog' }).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('Test Blog')
            await textboxes[1].fill('Test Author')
            await textboxes[2].fill('www.testUrl.com')
            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('Test Blog Test Author')).toBeVisible()
        })
        test('blog can be liked', async ({ page }) => {
            await page.getByRole('textbox').first().fill('ttesti')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByRole('button', { name: 'new blog' }).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('Test Blog')
            await textboxes[1].fill('Test Author')
            await textboxes[2].fill('www.testUrl.com')
            await page.getByRole('button', { name: 'create' }).click()
            await page.getByRole('button', { name: 'view' }).click()
            const likesBefore = await page.getByTestId('likes').textContent()
            await expect(likesBefore).toBe('0')
            await page.getByRole('button', { name: 'like' }).click()
            await page.waitForTimeout(2000)
            const likesAfter = await page.getByTestId('likes').textContent()
            await expect(likesAfter).toBe('1')
        })
        test('blog can be deleted', async ({ page }) => {
            await page.getByRole('textbox').first().fill('ttesti')
            await page.getByRole('textbox').last().fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
            await page.getByRole('button', { name: 'new blog' }).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('Test Blog')
            await textboxes[1].fill('Test Author')
            await textboxes[2].fill('www.testUrl.com')
            await page.getByRole('button', { name: 'create' }).click()
            await page.getByRole('button', { name: 'view' }).click()
            await page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()
            await page.waitForTimeout(2000)
            await expect(page.getByText('Test Blog Test Author')).not.toBeVisible()
        })
    })
  
})