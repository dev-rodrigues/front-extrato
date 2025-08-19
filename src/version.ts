/**
 * Arquivo centralizado para a versão da aplicação
 * Esta versão é sincronizada automaticamente com package.json
 */

// Versão da aplicação - sincronizada com package.json
export const APP_VERSION = '1.3.5'

// Função para obter a versão atual
export function getAppVersion(): string {
  return APP_VERSION
}

// Função para obter a versão formatada (com 'v' prefix)
export function getFormattedVersion(): string {
  return `v${APP_VERSION}`
}
