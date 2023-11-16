#!/usr/bin/env node

import spawn from 'cross-spawn'
import { blue, green, reset, yellow } from 'kolorist'
import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'

function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, '')
}

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
  _git: '.git',
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    // ignore node_modules
    if (path.basename(src) === 'node_modules') return
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

type ColorFunc = (str: string | number) => string

const TEMPLATES: { name: string; color: ColorFunc }[] = [
  {
    name: 'react',
    color: blue,
  },
  {
    name: 'react-i18n',
    color: yellow,
  },
  {
    name: 'next-page',
    color: green,
  },
]

function generateGit() {
  const existGit = fs.existsSync('.git')
  if (existGit) {
    return true
  }
  spawn.sync('git', ['init'], {
    stdio: 'ignore',
  })
}

async function init() {
  let result: prompts.Answers<'projectName' | 'template'>

  let targetDir = ''

  const getProjectName = () => (targetDir === '.' ? path.basename(path.resolve()) : targetDir)

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: reset('Project name:'),
          validate: (value) => {
            if (!value) return 'Project name is required'
            if (fs.existsSync(value)) return `The directory ${value} is already exists`
            return true
          },
          onState: (state) => {
            targetDir = formatTargetDir(state.value)
          },
        },
        {
          type: 'select',
          name: 'template',
          message: reset('Select a template:'),
          initial: 0,
          choices: TEMPLATES.map((template) => ({
            title: template.color(template.name),
            value: template.name,
          })),
        },
      ],
      {
        onCancel() {
          process.exit(0)
        },
      },
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  // user choice associated with prompts
  const { template } = result

  const root = path.join(cwd(), targetDir)

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  process.chdir(root)

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../src/', `template-${template}`)

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  generateGit()

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'))

  pkg.name = getProjectName()

  write('package.json', `${JSON.stringify(pkg, null, 2)}\n`)

  const cdProjectName = path.relative(cwd(), root)

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd()) {
    console.log(`  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`)
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}

init().catch((e) => {
  console.error(e)
})
