import CryptoJS from 'crypto-js'

const SECRET = 'some-secret'

export function decrypt(word: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(word),
      } as CryptoJS.lib.CipherParams,
      CryptoJS.enc.Utf8.parse(SECRET),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding,
      },
    )

    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return word
  }
}
