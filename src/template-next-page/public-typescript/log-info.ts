import { logTimeInfo } from 'picologger'
import { getEnv } from '@/utils/env'

const script = document.createElement('script')

script.textContent = logTimeInfo(getEnv())

document.body.appendChild(script)
