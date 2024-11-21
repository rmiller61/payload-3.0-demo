import { createHmac } from "crypto"

/**
 *
 * @url https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html
 */
export const createSESSMTPPassword = (secretKey: string) => {
  const getBytes = (str: string) => {
    let bytes: number[] = []
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i))
    }
    return bytes
  }
  const message = "SendRawEmail"
  const version = new Buffer([0x02])
  const signature = createHmac("sha256", new Buffer(getBytes(secretKey)))
    .update(message)
    .digest()
  const sigAndVer = Buffer.concat([version, signature])

  return sigAndVer.toString("base64")
}
