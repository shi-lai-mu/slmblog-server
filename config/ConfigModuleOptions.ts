import { ConfigModuleOptions } from '@nestjs/config'
import * as path from 'path'

export const configModuleOptions: ConfigModuleOptions = {
  encoding: 'utf-8',
  isGlobal: true,
  expandVariables: true,
  ignoreEnvVars: true,
  envFilePath: [
    path.join('config', 'env', process.env.NODE_ENV === 'development' ? '.dev.env' : '.prod.env'),
  ],
  validationOptions: {
    allowUnknown: false,
    abortEarly: true,
  },
}
