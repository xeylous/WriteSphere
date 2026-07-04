import mongoose from 'mongoose';
import { User, Category, Tag, Blog, Comment, Like, Bookmark } from '../models';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/writesphere';

const sampleUsers = [
  {
    name: 'Sarah Chen',
    email: 'sarah@writesphere.com',
    password: 'Password123',
    role: 'author',
    bio: 'AI researcher and technical writer. Exploring the intersection of machine learning and creative expression.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    themePreference: 'dark',
    social: { website: 'https://sarahchen.dev', twitter: 'https://twitter.com/sarahchen' },
  },
  {
    name: 'Alex Rivera',
    email: 'alex@writesphere.com',
    password: 'Password123',
    role: 'author',
    bio: 'Senior engineer at a top-tier tech company. Writing about scalable systems, clean code, and developer experience.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    themePreference: 'light',
  },
  {
    name: 'Maya Johnson',
    email: 'maya@writesphere.com',
    password: 'Password123',
    role: 'author',
    bio: 'Product designer crafting inclusive digital experiences. Passionate about accessibility and design systems.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  },
];

const sampleCategories = [
  { name: 'Technology', slug: 'technology', description: 'Latest in tech, devices, and engineering', icon: '⚡' },
  { name: 'AI & ML', slug: 'ai-ml', description: 'Machine learning, neural networks, and AI research', icon: '🧠' },
  { name: 'Design', slug: 'design', description: 'UI/UX design, visual design, and design systems', icon: '🎨' },
  { name: 'Programming', slug: 'programming', description: 'Code tutorials, software architecture, and development principles', icon: '💻' },
  { name: 'Business', slug: 'business', description: 'Startups, strategy, finance, and entrepreneurship', icon: '📊' },
];

const sampleTags = ['TypeScript', 'React', 'NodeJS', 'Redis', 'Docker', 'CSS', 'Accessibility', 'UX', 'AI', 'NLP'];

const sampleBlogs = [
  {
    title: 'The Future of AI in Creative Writing',
    content: `Artificial intelligence is changing how we write, edit, and create. In this article, we look at the evolution of Large Language Models and how they act as collaborative assistants.

## Co-Writing with the Machine

The goal of AI in writing is not substitution, but collaboration. Writers can use models to brainstorm, format, outline, or restructure concepts.

### Key Workflows
* **Brainstorming**: Generating headlines and concept drafts.
* **Editing**: Checking grammar and sentence structure.
* **Summarization**: Generating key takeaways instantly.

We will look at how this changes editorial pipelines globally in the next decade.`,
    excerpt: 'How artificial intelligence is reshaping the way we write, edit, and think about content creation.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    status: 'published',
    isFeatured: true,
  },
  {
    title: 'Building Scalable APIs with Node.js and Express',
    content: `Express has been a cornerstone of backend development for a decade. But how do you scale it to millions of requests?

## Best Practices
1. **Connection Pooling**: Reusing database sockets.
2. **Redis Caching**: Keeping active read objects in memory.
3. **Queue Processing**: Offloading slow actions using BullMQ.

Let's dive into code samples that prove these practices in real production apps.`,
    excerpt: 'Detailed architectures and best practices for scaling Node.js applications under heavy loads.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    status: 'published',
  },
  {
    title: 'Design Systems That Actually Work in Production',
    content: `Building a design system is easy, but making it scale and maintaining alignment across teams is where the challenge lies.

## Structuring Design Tokens
Tokens are the core definitions. Colors, spacing, typography, and borders should all be mapped as HSL values or properties.

## Component Reusability
Always follow solid design guidelines. Make components drop-in, stateless, and documented.`,
    excerpt: 'A practical look at architecting, maintaining, and scaling modern design systems in large products.',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    status: 'published',
  },
];

async function seed() {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Clear existing data
    console.log('Clearing existing records...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Blog.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Bookmark.deleteMany({}),
    ]);

    // Create Users
    console.log('Creating users...');
    const users = await User.create(sampleUsers);
    const authorMap = {
      'Sarah Chen': users[0]._id,
      'Alex Rivera': users[1]._id,
      'Maya Johnson': users[2]._id,
    };

    // Create Categories
    console.log('Creating categories...');
    const categories = await Category.create(sampleCategories);

    // Create Tags
    console.log('Creating tags...');
    const tags = await Tag.create(sampleTags.map((name) => ({ name, slug: name.toLowerCase() })));

    // Create Blogs
    console.log('Creating blogs...');
    const blogsData = sampleBlogs.map((blog, index) => {
      const author = index === 0 ? users[0] : index === 1 ? users[1] : users[2];
      const category = categories[index % categories.length];
      const blogTags = [tags[index % tags.length]._id, tags[(index + 2) % tags.length]._id];
      const slug = blog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      return {
        ...blog,
        slug,
        author: author._id,
        category: category._id,
        tags: blogTags,
        readingTime: 6 + index * 2,
        views: 120 + index * 400,
        likesCount: 15 + index * 30,
        commentsCount: 2 + index,
        bookmarksCount: index * 4,
        publishedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      };
    });

    const blogs = await Blog.create(blogsData);

    // Update user blogCount
    await Promise.all(
      users.map(async (u) => {
        const count = await Blog.countDocuments({ author: u._id });
        u.blogCount = count;
        await u.save();
      }),
    );

    // Update category blogCount
    await Promise.all(
      categories.map(async (c) => {
        const count = await Blog.countDocuments({ category: c._id });
        c.blogCount = count;
        await c.save();
      }),
    );

    // Update tag blogCount
    await Promise.all(
      tags.map(async (t) => {
        const count = await Blog.countDocuments({ tags: t._id });
        t.blogCount = count;
        await t.save();
      }),
    );

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
