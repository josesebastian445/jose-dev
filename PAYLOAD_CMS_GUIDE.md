# Payload CMS Integration Guide

## Overview
This project now uses Payload CMS v3 for content management, replacing the previous file-based MDX system.

## Features
- **Modern CMS**: Payload CMS v3 with React 19 and Next.js 15
- **Rich Text Editor**: Lexical editor for powerful content editing
- **Media Management**: Upload and manage images with automatic resizing
- **Type-Safe**: Full TypeScript support with auto-generated types
- **Database**: MongoDB for flexible data storage

## Getting Started

### 1. Environment Variables
Create or update your `.env.local` file with the following:

```bash
# Payload CMS Configuration
PAYLOAD_SECRET=your-secret-key-here-change-this-to-a-random-string
MONGODB_URI=mongodb://localhost:27017/jose-cyber
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**Important**: Change `PAYLOAD_SECRET` to a secure random string before deploying to production.

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB: `mongod`
3. The database will be created automatically on first run

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 3. Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Run the development server
npm run dev
```

### 4. Accessing the CMS Admin

1. Start the dev server
2. Navigate to: `http://localhost:3000/admin`
3. Create your first admin user account
4. Start creating content!

## Collections

### Posts
Blog posts with:
- Title & Slug
- Rich text content (Lexical editor)
- Featured image
- Excerpt for listings
- Tags
- Published date
- Status (Draft/Published)
- SEO metadata

### Media
Image uploads with:
- Automatic image resizing (thumbnail, card, featured)
- Alt text
- Caption
- Storage in `/media` directory

### Users
Admin users with:
- Email & password authentication
- Name
- Role (Admin/Editor)

## Content Management Workflow

1. **Login** to `/admin`
2. **Create a new post** in the Posts collection
3. **Add content** using the rich text editor
4. **Upload a featured image** (optional)
5. **Add tags** for categorization
6. **Set status** to "Published" when ready
7. **Save** - the post will appear on your blog immediately!

## API Routes

Payload CMS automatically creates REST and GraphQL APIs:

- **REST API**: `http://localhost:3000/api/*`
- **Admin Panel**: `http://localhost:3000/admin`

Example API calls:
```bash
# Get all published posts
GET /api/posts?where[status][equals]=published

# Get a single post by slug
GET /api/posts?where[slug][equals]=your-slug&limit=1
```

## File Structure

```
├── collections/           # Payload collections
│   ├── Users.ts          # User authentication
│   ├── Posts.ts          # Blog posts
│   └── Media.ts          # Media library
├── app/
│   ├── (payload)/        # Payload routes
│   │   ├── admin/        # Admin UI
│   │   └── api/          # REST API
│   ├── content/blog/     # Blog pages
│   └── lib/
│       └── payload-client.ts  # Payload helper functions
├── components/
│   └── RichText.tsx      # Rich text renderer
├── payload.config.ts     # Payload configuration
└── .env.local            # Environment variables
```

## Migration Notes

### From MDX to Payload CMS

**Before**: Blog posts were stored as `.mdx` files in `/content/blog/`

**After**: Blog posts are managed through Payload CMS and stored in MongoDB

**Backwards Compatibility**: The old MDX posts are still in the repository but are no longer used. The blog pages now fetch content from Payload CMS.

To migrate existing content:
1. Open your old MDX files
2. Copy the content
3. Create new posts in Payload CMS admin
4. Paste and format the content

## Deployment

### Environment Variables for Production
Set these in your hosting platform (Vercel, Cloudflare Pages, etc.):

```bash
PAYLOAD_SECRET=<secure-random-string>
MONGODB_URI=<your-mongodb-atlas-connection-string>
NEXT_PUBLIC_SERVER_URL=<your-production-url>
```

### Build Command
```bash
npm run build
```

### Important: Media Files
The `/media` directory contains uploaded images. Make sure it's:
- Included in your deployment
- Has write permissions
- Is backed up regularly

## TypeScript Types

Payload automatically generates TypeScript types at `payload-types.ts`. These types are updated whenever you:
- Change collection configs
- Add/remove fields
- Modify field types

## Troubleshooting

### "Cannot connect to MongoDB"
- Check that MongoDB is running
- Verify `MONGODB_URI` in `.env.local`
- For MongoDB Atlas, check your IP whitelist

### "Payload secret not defined"
- Add `PAYLOAD_SECRET` to `.env.local`
- Use a strong, random string

### Admin page not loading
- Check that `/app/(payload)/admin/[[...segments]]/page.tsx` exists
- Verify `next.config.js` includes `withPayload`
- Clear `.next` cache: `rm -rf .next && npm run dev`

### Images not displaying
- Check that `/media` directory exists and has write permissions
- Verify image URLs in the database
- Check that images were uploaded successfully

## Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Lexical Editor](https://lexical.dev/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

## Support

For issues or questions:
1. Check the [Payload CMS Discord](https://discord.gg/payload)
2. Review [Payload documentation](https://payloadcms.com/docs)
3. Check MongoDB connection and logs
