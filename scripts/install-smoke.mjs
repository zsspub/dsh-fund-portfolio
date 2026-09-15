import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const home = mkdtempSync(join(tmpdir(), 'dsh-fund-install-'))
const dsh = resolve(root, 'node_modules/@deepseek-ai/dsh/lib/bin.js')

try {
  const environment = { ...process.env, DSH_HOME: home, npm_config_cache: join(home, 'npm-cache') }
  const packed = JSON.parse(execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', home], {
    cwd: root,
    env: environment,
    encoding: 'utf8',
  }))
  const archive = join(home, packed[0].filename)
  const paths = packed[0].files.map(file => file.path)
  for (const required of ['package.json', 'cordis.patch.yml', 'lib/index.js', 'lib/client.js', 'lib/typert.remote-client.js']) {
    if (!paths.includes(required)) throw new Error(`Package is missing ${required}`)
  }
  if (paths.some(path => path.startsWith('src/') || /\.(?:sqlite3?|db|env)$/u.test(path))) {
    throw new Error('Package contains private or source-only files')
  }
  execFileSync(process.execPath, [dsh, '--profile', 'fund-smoke', '--from-default-profile', 'web', '--dump-config'], {
    cwd: root,
    env: environment,
    stdio: 'ignore',
  })
  execFileSync(process.execPath, [dsh, 'plugin', '--profile', 'fund-smoke', 'add', archive], {
    cwd: root,
    env: environment,
    stdio: 'inherit',
  })
  const composition = execFileSync(process.execPath, [dsh, '--profile', 'fund-smoke', '--dump-config'], {
    cwd: root,
    env: environment,
    encoding: 'utf8',
  })
  for (const expected of ['name: dsh-fund-portfolio', 'name: dsh-fund-portfolio/tools']) {
    if (!composition.includes(expected)) throw new Error(`Installed profile is missing ${expected}`)
  }
} finally {
  rmSync(home, { recursive: true, force: true })
}
