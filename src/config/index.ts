export default {
  baseUrl: 'http://127.0.0.1:22001',
  imgPath: '/imgs/',
  filePreview: 'http://127.0.0.1/static/uploads/'
}
const BASE_URL_MAP = {
  DEV: '',
  PROD: '',
  // GP_PAGES: '/dist',
  GP_PAGES: '',
  GITEE_PAGES: '/douyin',
  UNI: 'http://127.0.0.1'
}

export const IS_SUB_DOMAIN = ['GITEE_PAGES', 'GP_PAGES'].includes(import.meta.env.VITE_ENV)
export const IS_GITEE_PAGES = ['GITEE_PAGES'].includes(import.meta.env.VITE_ENV)
export const BASE_URL = BASE_URL_MAP[import.meta.env.VITE_ENV]
export const IMG_URL = BASE_URL + '/images/'
export const FILE_URL = BASE_URL + '/data/'
export const IS_DEV = process.env.NODE_ENV !== 'production'
