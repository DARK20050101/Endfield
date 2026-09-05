import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeProbeReport } from '../app/services/login-probe.ts'
test('even a visible binding never becomes a verified credential', () => {
  const report = makeProbeReport('loaded', 'visible')
  assert.equal(report.credentialReceived, false)
  assert.deepEqual(Object.keys(report), ['schemaVersion', 'page', 'binding', 'credentialReceived'])
})
test('raw URLs and secrets cannot be included in observations or errors', () => {
  const secret = 'SYNTHETIC_SECRET_NOT_FOR_LOGGING'
  for (const input of [secret, { token: secret }, null, [], 'https://invalid.test/?token='+secret]) {
    assert.throws(() => makeProbeReport(input, 'visible'), e =>
      e.message === 'INVALID_OBSERVATION' && !e.message.includes(secret))
    assert.throws(() => makeProbeReport('loaded', input), /INVALID_OBSERVATION/)
  }
})
test('untested and failed observations stay separate', () => {
  assert.equal(makeProbeReport('not_tested', 'not_checked').page, 'not_tested')
  assert.equal(makeProbeReport('network_error', 'missing').binding, 'missing')
})
