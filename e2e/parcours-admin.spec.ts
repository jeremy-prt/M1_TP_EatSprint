import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Parcours administrateur', () => {
  test('Admin gère les restaurateurs : connexion → dashboard → ajout restaurateur', async ({ page, goto }) => {
    // 1. Aller sur la page de connexion
    await goto('/auth/login', { waitUntil: 'hydration' })
    await expect(page).toHaveURL('/auth/login')

    // 2. Se connecter avec le compte admin
    await page.locator('input[type="email"]').fill('admin@gmail.com')
    await page.locator('input[type="password"]').fill('Password123')
    await page.getByRole('button', { name: /(se connecter|log in)/i }).click()

    // 3. Après connexion, devrait être sur /mon-espace-perso
    await page.waitForURL('/mon-espace-perso', { timeout: 10000 })

    // 4. Naviguer vers le dashboard admin
    await goto('/admin/dashboard', { waitUntil: 'hydration' })
    await expect(page).toHaveURL('/admin/dashboard')

    // 5. Vérifier que le titre "Restaurateurs" est visible
    await expect(page.locator('h2:has-text("Restaurateurs")')).toBeVisible()

    // 6. Attendre que la table soit chargée (vérifier qu'il n'y a pas de skeleton)
    await page.waitForSelector('table', { state: 'visible', timeout: 10000 })

    // 7. Cliquer sur le bouton "Ajouter"
    const addButton = page.getByRole('button', { name: /ajouter/i })
    await expect(addButton).toBeVisible()
    await addButton.click()

    // 8. Attendre que le modal s'ouvre (vérifier le titre du modal)
    await expect(page.locator('text=/Ajouter un restaurateur/i')).toBeVisible({ timeout: 5000 })

    // 9. Remplir le formulaire avec des données de test
    const timestamp = Date.now()
    const testEmail = `resto-test-${timestamp}@example.com`

    await page.locator('input[placeholder="Nom du restaurateur"]').fill(`Test Restaurateur ${timestamp}`)
    await page.locator('input[type="email"][placeholder="email@example.com"]').fill(testEmail)
    await page.locator('input[type="password"]').fill('TestPassword123')

    // Champs optionnels
    await page.locator('input[placeholder="123 rue de la Paix"]').fill('123 rue Test')
    await page.locator('input[placeholder="Paris"]').fill('Paris')
    await page.locator('input[placeholder="75000"]').fill('75001')

    // 10. Cliquer sur le bouton "Créer"
    const createButton = page.getByRole('button', { name: /créer/i })
    await expect(createButton).toBeVisible()
    await createButton.click()

    // 11. Attendre que le modal se ferme (le modal devrait disparaître)
    await expect(page.locator('text=/Ajouter un restaurateur/i')).toBeHidden({ timeout: 10000 })

    // 12. Vérifier que le nouveau restaurateur apparaît dans la table
    await expect(page.locator(`text=${testEmail}`)).toBeVisible({ timeout: 5000 })

    // 13. Vérifier qu'il y a bien le badge "Restaurateur" visible
    await expect(page.locator('text=/restaurateur/i').first()).toBeVisible()

    // 14. Fermer le toast s'il est visible (il bloque les boutons)
    const toastCloseButton = page.locator('button[aria-label*="close"], button[aria-label*="fermer"], [role="alert"] button').first()
    const isToastVisible = await toastCloseButton.isVisible().catch(() => false)
    if (isToastVisible) {
      await toastCloseButton.click()
      await page.waitForTimeout(300) // Petit délai pour l'animation
    } else {
      // Si pas de bouton close, attendre que le toast disparaisse
      await page.waitForTimeout(6000)
    }

    // 15. Nettoyer : supprimer le restaurateur créé
    // Trouver la ligne du restaurateur créé
    const createdRow = page.locator(`tr:has-text("${testEmail}")`)
    await expect(createdRow).toBeVisible()

    // 16. Préparer la gestion de la popup de confirmation AVANT le clic
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm')
      await dialog.accept()
    })

    // 17. Cliquer sur le dernier bouton (supprimer) de cette ligne
    const deleteButton = createdRow.locator('button').last()
    await deleteButton.click()

    // 18. Vérifier que le restaurateur a bien été supprimé
    await expect(page.locator(`text=${testEmail}`)).toBeHidden({ timeout: 5000 })
  })

  test('Admin édite un restaurateur existant', async ({ page, goto }) => {
    // 1. Se connecter en tant qu'admin
    await goto('/auth/login', { waitUntil: 'hydration' })
    await page.locator('input[type="email"]').fill('admin@gmail.com')
    await page.locator('input[type="password"]').fill('Password123')
    await page.getByRole('button', { name: /(se connecter|log in)/i }).click()
    await page.waitForURL('/mon-espace-perso', { timeout: 10000 })

    // 2. Aller sur le dashboard admin
    await goto('/admin/dashboard', { waitUntil: 'hydration' })
    await expect(page).toHaveURL('/admin/dashboard')

    // 3. Attendre que la table soit chargée
    await page.waitForSelector('table', { state: 'visible', timeout: 10000 })

    // 4. Vérifier qu'il y a au moins un restaurateur dans la table
    const firstRow = page.locator('tbody tr').first()
    await expect(firstRow).toBeVisible({ timeout: 5000 })

    // 5. Fermer le toast s'il est visible avant de cliquer
    const toastCloseButtonInitial = page.locator('button[aria-label*="close"], button[aria-label*="fermer"], [role="alert"] button').first()
    const isToastVisibleInitial = await toastCloseButtonInitial.isVisible().catch(() => false)
    if (isToastVisibleInitial) {
      await toastCloseButtonInitial.click()
      await page.waitForTimeout(300)
    }

    // 6. Cliquer sur le bouton d'édition du premier restaurateur (dans la colonne Actions)
    // Le bouton est dans la dernière cellule (td) de la première ligne
    const editButton = page.locator('tbody tr').first().locator('button').first()
    await expect(editButton).toBeVisible()
    await editButton.click()

    // 7. Attendre que le modal d'édition s'ouvre
    await expect(page.locator('text=/Éditer un restaurateur/i')).toBeVisible({ timeout: 5000 })

    // 8. Vérifier que les champs sont pré-remplis (le champ nom ne devrait pas être vide)
    const nameInput = page.locator('input[placeholder="Nom du restaurateur"]')
    await expect(nameInput).not.toHaveValue('')

    // 9. Sauvegarder le nom original pour le restaurer après
    const originalName = await nameInput.inputValue()
    const newName = `${originalName} - Modifié`
    await nameInput.fill(newName)

    // 10. Cliquer sur "Modifier"
    const modifyButton = page.getByRole('button', { name: /modifier/i })
    await expect(modifyButton).toBeVisible()
    await modifyButton.click()

    // 11. Attendre que le modal se ferme
    await expect(page.locator('text=/Éditer un restaurateur/i')).toBeHidden({ timeout: 10000 })

    // 12. Vérifier que le nom modifié apparaît dans la table
    await expect(page.locator('tbody tr').first().locator('p.font-semibold').filter({ hasText: newName })).toBeVisible({ timeout: 5000 })

    // 13. Fermer le toast de succès avant de continuer
    const toastCloseButton = page.locator('button[aria-label*="close"], button[aria-label*="fermer"], [role="alert"] button').first()
    const isToastVisible = await toastCloseButton.isVisible().catch(() => false)
    if (isToastVisible) {
      await toastCloseButton.click()
      await page.waitForTimeout(300)
    } else {
      await page.waitForTimeout(6000)
    }

    // 14. Nettoyer : restaurer le nom original
    const editButtonAgain = page.locator('tbody tr').first().locator('button').first()
    await editButtonAgain.click()

    // 15. Attendre l'ouverture du modal
    await expect(page.locator('text=/Éditer un restaurateur/i')).toBeVisible({ timeout: 5000 })

    // 16. Restaurer le nom original
    const nameInputAgain = page.locator('input[placeholder="Nom du restaurateur"]')
    await nameInputAgain.fill(originalName)

    // 17. Cliquer sur "Modifier"
    const modifyButtonAgain = page.getByRole('button', { name: /modifier/i })
    await modifyButtonAgain.click()

    // 18. Vérifier que le modal se ferme et que le nom est restauré
    await expect(page.locator('text=/Éditer un restaurateur/i')).toBeHidden({ timeout: 10000 })
    await expect(page.locator('tbody tr').first().locator('p.font-semibold').filter({ hasText: originalName })).toBeVisible({ timeout: 5000 })
  })
})
