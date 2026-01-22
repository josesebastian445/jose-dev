import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Your Payload config goes here
  // Payload will use the default secret (from environment variable)
  // Make sure you have a PAYLOAD_SECRET in your .env file
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',

  // Database adapter
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/jose-cyber',
  }),

  // Rich text editor
  editor: lexicalEditor({}),

  // Collections
  collections: [Users, Posts, Media],

  // Admin configuration
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Jose Cyber Pro CMS',
      favicon: '/favicon-32x32.png',
    },
  },

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // File upload configuration
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})
