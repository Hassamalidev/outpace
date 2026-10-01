import { browser, defineBackground } from '#imports'

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
      void browser.storage.local.set({ installedAt: Date.now() })
    }
  })
})
