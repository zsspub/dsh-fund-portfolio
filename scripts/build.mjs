import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { build } from 'tsdown'
import { FaceModelEmitter, WorkspaceAnalyzer } from '@deepseek-ai/dsh-typert-generator'

const root = resolve(import.meta.dirname, '..')
const runTsc = config => execFileSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', config], { cwd: root, stdio: 'inherit' })
const withTypertFactories = source => {
  const adapted = source.replace(/\bschema: ([A-Za-z_$][\w$]*),/gu, 'create: () => $1,')
  if (/\bschema:/u.test(adapted) || !/\bcreate:/u.test(adapted)) {
    throw new Error('Generated Typert artifact does not expose create() factories')
  }
  return adapted
}
await rm(resolve(root, 'lib'), { recursive: true, force: true })
runTsc('tsconfig.host.json')
const scratch = resolve(root, 'node_modules/.cache/portfolio-typert')
const packageRoot = resolve(scratch, 'packages/portfolio')
const protocolRoot = resolve(scratch, 'packages/protocol')
await mkdir(packageRoot, { recursive: true })
await mkdir(protocolRoot, { recursive: true })
await cp(resolve(root, 'src'), resolve(packageRoot, 'src'), { recursive: true })
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
await writeFile(resolve(packageRoot, 'package.json'), JSON.stringify(manifest))
const compilerOptions = {
  target: 'ES2024', module: 'NodeNext', moduleResolution: 'NodeNext',
  strict: true, skipLibCheck: true, noEmit: true, allowImportingTsExtensions: true,
  types: ['node'], typeRoots: [resolve(root, 'node_modules/@types')],
  paths: {
    '@deepseek-ai/dsh-typert-protocol': [resolve(protocolRoot, 'src/index.ts')],
    '@deepseek-ai/dsh-typert-protocol/types': [resolve(protocolRoot, 'src/types.ts')],
    '*': [resolve(root, 'node_modules/*')],
  },
}
await cp(resolve(root, 'node_modules/@deepseek-ai/dsh-typert-protocol/lib/types'), resolve(protocolRoot, 'lib/types'), { recursive: true })
await cp(resolve(root, 'node_modules/@deepseek-ai/dsh-typert-protocol/package.json'), resolve(protocolRoot, 'package.json'))
await mkdir(resolve(protocolRoot, 'src'), { recursive: true })
for (const file of await readdir(resolve(protocolRoot, 'lib/types'))) {
  if (file.endsWith('.d.ts')) {
    await cp(resolve(protocolRoot, 'lib/types', file), resolve(protocolRoot, 'src', file.replace(/\.d\.ts$/, '.ts')))
  }
}
await writeFile(resolve(protocolRoot, 'tsconfig.json'), JSON.stringify({ compilerOptions, include: ['src/**/*.ts'] }))
await writeFile(resolve(packageRoot, 'tsconfig.host.json'), JSON.stringify({
  compilerOptions, include: ['src/index.ts', 'src/tools.ts', 'src/types.ts', 'src/host/**/*.ts'],
}))
await writeFile(resolve(scratch, 'tsconfig.host.json'), JSON.stringify({
  compilerOptions, files: [], references: [{ path: './packages/portfolio/tsconfig.host.json' }, { path: './packages/protocol' }],
}))
const model = new WorkspaceAnalyzer({ root: scratch, faces: ['host'], packages: ['dsh-fund-portfolio'] }).analyze()
const face = model.faces.find(item => item.face === 'host')
if (!face) throw new Error('Missing Host type model')
const artifact = new FaceModelEmitter(face).emit('dsh-fund-portfolio')
if (!artifact.remote) throw new Error('Missing generated Remote methods')
await mkdir(resolve(root, 'lib'), { recursive: true })
await Promise.all([
  writeFile(resolve(root, 'lib/typert.host.js'), withTypertFactories(artifact.js)),
  writeFile(resolve(root, 'lib/typert.host.d.ts'), artifact.dts),
  writeFile(resolve(root, 'lib/typert.remote-client.js'), withTypertFactories(artifact.remote.js)),
  writeFile(resolve(root, 'lib/typert.remote-client.d.ts'), artifact.remote.dts),
  writeFile(resolve(root, 'lib/typert.remote-client.d.ts.map'), artifact.remote.dtsMap),
])
runTsc('tsconfig.client.json')
const external = [...Object.keys(manifest.peerDependencies), 'react', 'react-dom', 'react/jsx-runtime']
await build({ entry: ['lib/types/index.js', 'lib/types/tools.js'], outDir: 'lib', platform: 'node', format: 'esm', target: 'es2024', fixedExtension: false, clean: false, dts: false, deps: { neverBundle: external } })
const clientExternals = new Set(['react', 'react-dom', 'react/jsx-runtime', '@deepseek-ai/dsh-client-ui-primitives'])
await build({
  entry: { client: 'lib/types/client/index.js' }, outDir: 'lib', platform: 'browser',
  format: 'cjs', target: 'es2022', clean: false, dts: false,
  deps: { neverBundle: specifier => clientExternals.has(specifier), alwaysBundle: specifier => !clientExternals.has(specifier) },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: "dsh-fund-portfolio", factory: (require) => {',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
    footer: 'return module.exports; } });',
  },
})
const clientPath = resolve(root, 'lib/client.js')
const clientSource = await readFile(clientPath, 'utf8')
await writeFile(clientPath, clientSource.replace(/[ \t]+$/gmu, ''))
