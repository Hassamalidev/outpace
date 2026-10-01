import packageJson from '../../package.json'

export const APP_VERSION: string = process.env.APP_VERSION ?? packageJson.version
