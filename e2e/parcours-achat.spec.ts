import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Parcours d\'achat complet', () => {
  test('Utilisateur non connecté : navigation → ajout panier → connexion → commande', async ({ page, goto }) => {
    // 1. Aller sur la page des restaurants
    await goto('/restaurants', { waitUntil: 'hydration' })
    await expect(page).toHaveURL('/restaurants')

    // 2. Attendre que les restaurants soient chargés et cliquer sur le premier
    await page.waitForSelector('a[href*="/restaurants/"]', { timeout: 15000 })
    const firstRestaurant = page.locator('a[href*="/restaurants/"]').first()
    await firstRestaurant.click()

    // 3. Attendre d'être sur la page du restaurant avec la liste des plats
    await page.waitForURL(/\/restaurants\/[^/]+\/plats/)

    // 4. Attendre que les plats soient chargés et cliquer sur le premier plat
    await page.waitForSelector('a[href*="/plats/"]', { timeout: 15000 })
    const firstPlat = page.locator('a[href*="/plats/"]').first()
    await firstPlat.click()

    // 5. Attendre d'être sur la page détail du plat
    await page.waitForURL(/\/restaurants\/[^/]+\/plats\/[^/]+$/)

    // 6. Cliquer sur "Ajouter au panier" (fonctionne en FR et EN)
    const addToCartButton = page.getByRole('button', { name: /(ajouter au panier|add to cart)/i })
    await addToCartButton.waitFor({ state: 'visible' })
    await addToCartButton.click({ force: true })

    // 7. Attendre que le panier widget soit mis à jour
    await page.waitForSelector('a[href="/panier"]', { state: 'visible' })

    // 8. Cliquer sur l'icône du panier dans le header ou widget
    const cartWidget = page.locator('a[href="/panier"]').first()
    await cartWidget.click()

    // 9. Devrait être redirigé vers /auth/login (middleware auth)
    await page.waitForURL('/auth/login')

    // 10. Se connecter avec un utilisateur test
    await page.locator('input[type="email"]').fill('customer@test.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByRole('button', { name: /(se connecter|log in)/i }).click()

    // 11. Après connexion, devrait être sur /mon-espace-perso
    await page.waitForURL('/mon-espace-perso', { timeout: 5000 })

    // 12. Retourner au panier
    await goto('/panier', { waitUntil: 'hydration' })
    await expect(page).toHaveURL('/panier')
    await expect(page.locator('h1')).toContainText(/(panier|cart)/i)

    // 13. Vérifier que le plat est dans le panier (vérifier qu'il y a un total)
    await expect(page.locator('text=/€/').first()).toBeVisible()

    // 14. Cliquer sur "Commander"
    const orderButton = page.getByRole('button', { name: /(commander|order)/i })
    await expect(orderButton).toBeVisible()
    await orderButton.click()

    // 15. Attendre la redirection vers /mes-commandes
    await page.waitForURL('/mes-commandes', { timeout: 5000 })
    await expect(page.locator('h1')).toContainText(/(commandes|orders)/i)

    // 16. Vérifier qu'une commande apparaît
    await expect(page.locator('text=/Commande #/i').or(page.locator('text=/Order #/i')).first()).toBeVisible()

    // 17. Vérifier qu'il y a un prix affiché
    await expect(page.locator('text=/€/').first()).toBeVisible()
  })

  test('Utilisateur déjà connecté : navigation → ajout panier → commande directe', async ({ page, goto }) => {
    // 1. Se connecter d'abord
    await goto('/auth/login', { waitUntil: 'hydration' })
    await page.locator('input[type="email"]').fill('customer@test.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByRole('button', { name: /(se connecter|log in)/i }).click()
    await page.waitForURL('/mon-espace-perso', { timeout: 10000 })

    // 2. Aller sur la page des restaurants
    await goto('/restaurants', { waitUntil: 'hydration' })

    // 3. Cliquer sur le premier restaurant
    await page.waitForSelector('a[href*="/restaurants/"]', { timeout: 15000 })
    const firstRestaurant = page.locator('a[href*="/restaurants/"]').first()
    await firstRestaurant.click()

    // 4. Cliquer sur le premier plat
    await page.waitForURL(/\/restaurants\/[^/]+\/plats/)
    await page.waitForSelector('a[href*="/plats/"]', { timeout: 15000 })
    const firstPlat = page.locator('a[href*="/plats/"]').first()
    await firstPlat.click()

    // 5. Ajouter au panier
    await page.waitForURL(/\/restaurants\/[^/]+\/plats\/[^/]+$/)
    const addToCartButton = page.getByRole('button', { name: /(ajouter au panier|add to cart)/i })
    await addToCartButton.waitFor({ state: 'visible' })
    await addToCartButton.click({ force: true })
    await page.waitForSelector('a[href="/panier"]', { state: 'visible' })

    // 6. Aller directement au panier
    await goto('/panier', { waitUntil: 'hydration' })
    await expect(page).toHaveURL('/panier')

    // 7. Commander
    const orderButton = page.getByRole('button', { name: /(commander|order)/i })
    await orderButton.click()

    // 8. Vérifier la redirection vers mes-commandes
    await page.waitForURL('/mes-commandes')
    await expect(page.locator('text=/Commande #/i').or(page.locator('text=/Order #/i')).first()).toBeVisible()
  })
})
