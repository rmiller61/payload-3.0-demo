import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { s3Storage } from '@payloadcms/storage-s3'
import { env } from '@/env.mjs'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import { createSESSMTPPassword } from "@/utilities/smtp"
import { Contact } from "@/globals/Contact"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages],
  globals: [Contact],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: env.DATABASE_URI,
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: env.SMTP_FROM_EMAIL,
    defaultFromName: env.SMTP_FROM_NAME,
    // Any Nodemailer transport
    transport: await nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: createSESSMTPPassword(env.SMTP_PASS),
      },
      debug: env.NODE_ENV === "development",
    }),
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          prefix: env.S3_FOLDER_PREFIX,
        },
      },
      config: {
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID as string,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY as string,
        },
      },
      bucket: env.S3_BUCKET,
    }),
  ],
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "schema.graphql"),
    disablePlaygroundInProduction: false,
  },
})
