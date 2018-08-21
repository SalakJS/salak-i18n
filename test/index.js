const app = require('./fixtures')
const request = require('supertest')

describe('test i18n', () => {
  let callback

  beforeAll(async () => {
    callback = await app.callback()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('test ctx.__(key, ...args)', () => {
    it('test `defaultLocale`', async () => {
      const res = await request(callback).get('/').expect(200)

      const ret = JSON.parse(res.text)
      expect(ret.data).toEqual({ welcome: 'hi', title: 'name' })
    })

    it('test `query` locale', async () => {
      const res = await request(callback).get('/?locale=zh-CN').expect(200)

      const ret = JSON.parse(res.text)
      expect(ret.data).toEqual({ welcome: '您好', title: '标题' })
    })

    it('test `Accept-Language` header', async () => {
      const res = await request(callback).get('/').set({ 'Accept-Language': 'zh-CN, zh;q=0.9, en;q=0.8, de;' }).expect(200)

      const ret = JSON.parse(res.text)
      expect(ret.data).toEqual({ welcome: '您好', title: '标题' })
    })

    it('test `locale` cookie', async () => {
      const res = await request(callback).get('/').set({ 'Cookie': 'locale=zh-CN' }).expect(200)

      const ret = JSON.parse(res.text)
      expect(ret.data).toEqual({ welcome: '您好', title: '标题' })
    })

    it('test `localeAlias`', async () => {
      const res = await request(callback).get('/?locale=zh-Hans').expect(200)

      const ret = JSON.parse(res.text)
      expect(ret.data).toEqual({ welcome: '您好', title: '标题' })
    })
  })

  describe('test ctx.gettext(key, ...args)', () => {
    it('test /gettext', async () => {
      const res = await request(callback).get('/').expect(200)

      const ret = JSON.parse(res.text)
      expect(ret.data).toEqual({ welcome: 'hi', title: 'name' })
    })
  })
})
