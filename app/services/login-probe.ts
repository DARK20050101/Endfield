export const OFFICIAL_LOGIN_URL = 'https://user.hypergryph.com/'
export type PageObservation = 'not_tested' | 'loaded' | 'network_error' | 'login_unavailable'
export type BindingObservation = 'not_checked' | 'visible' | 'missing'
export interface ProbeReport {
  schemaVersion: 1
  page: PageObservation
  binding: BindingObservation
  credentialReceived: false
}
const pages = new Set(['not_tested', 'loaded', 'network_error', 'login_unavailable'])
const bindings = new Set(['not_checked', 'visible', 'missing'])
// Only enumerated observations leave the UI. Never serialize input objects.
export function makeProbeReport(page: unknown, binding: unknown): ProbeReport {
  if (typeof page !== 'string' || !pages.has(page) ||
      typeof binding !== 'string' || !bindings.has(binding)) {
    throw new Error('INVALID_OBSERVATION')
  }
  return { schemaVersion: 1, page: page as PageObservation,
    binding: binding as BindingObservation, credentialReceived: false }
}
export async function openOfficialLogin(): Promise<void> {
  const { invoke, isTauri } = await import('@tauri-apps/api/core')
  if (isTauri()) {
    await invoke('open_official_login')
    return
  }
  const opened = window.open(OFFICIAL_LOGIN_URL, '_blank', 'noopener,noreferrer')
  // noopener browsers may return null even when opening succeeds.
  void opened
}
