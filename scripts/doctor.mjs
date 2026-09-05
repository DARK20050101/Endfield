import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
const checks = []
function command(name, args) {
  const r = spawnSync(name, args, { encoding: 'utf8', timeout: 15000, windowsHide: true })
  return { ok: r.status === 0, output: (r.stdout || '') + (r.stderr || '') }
}
const rust = command('rustc', ['--version'])
checks.push({ item: 'Rust', ready: rust.ok, version: rust.ok ? rust.output.trim() : undefined })
const cargo = command('cargo', ['--version'])
checks.push({ item: 'Cargo', ready: cargo.ok })
const targets = command('rustup', ['target', 'list', '--installed'])
checks.push({ item: 'Rust Android arm64 target', ready: targets.ok && targets.output.includes('aarch64-linux-android') })
const javaHome = process.env.JAVA_HOME
checks.push({ item: 'JAVA_HOME', ready: !!javaHome && fs.existsSync(path.join(javaHome, 'bin', 'java.exe')) })
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
checks.push({ item: 'Android SDK', ready: !!sdk && fs.existsSync(path.join(sdk, 'platforms')) })
checks.push({ item: 'Android build tools', ready: !!sdk && fs.existsSync(path.join(sdk, 'build-tools')) })
checks.push({ item: 'Android command-line tools', ready: !!sdk && fs.existsSync(path.join(sdk, 'cmdline-tools')) })
const ndk = process.env.NDK_HOME
checks.push({ item: 'NDK_HOME', ready: !!ndk && fs.existsSync(path.join(ndk, 'source.properties')) })
if (process.platform === 'win32') {
  const vswhere = path.join(process.env['ProgramFiles(x86)'] || 'C:/Program Files (x86)', 'Microsoft Visual Studio/Installer/vswhere.exe')
  const vs = command(vswhere, ['-latest', '-products', '*', '-requires', 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64', '-property', 'installationPath'])
  checks.push({ item: 'MSVC C++ build tools', ready: vs.ok && !!vs.output.trim() })
}
const ready = checks.every(c => c.ready)
console.log(JSON.stringify({ scope: 'build prerequisites only; no APK or login verification', ready, checks }, null, 2))
process.exitCode = ready ? 0 : 1
