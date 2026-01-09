# Therefor Bitcoin

> Mobile-first Bitcoin knowledge base frontend (Next.js + MDX) with a premium editorial design.

A comprehensive, balanced knowledge base helping people understand Bitcoin through well-researched, fair content. Clear answers, fair objections, and primary sources.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🎯 Project Vision

A premium, modern "linkable in conversations" Q&A wiki where users land on a specific question page and get a clear answer fast. Optimized for "user finds a useful answer in < 30 seconds."

### Design Principles

- **Premium editorial vibe**: Generous whitespace, strong typography, high contrast
- **Mobile-first**: Big tap targets, sticky navigation, search-first UX
- **Dark mode built-in**: Not an afterthought
- **Trust cues**: Sources, steelman objections, last updated dates
- **One accent color**: Bitcoin orange (#F7931A)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/thereforbitcoin.git
cd thereforbitcoin

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
thereforbitcoin/
├── content/                 # MDX content files
│   └── en/                  # English content
│       ├── beginner/        # Beginner-level articles
│       ├── criticism/       # Criticism articles
│       ├── lightning/       # Lightning Network articles
│       ├── mining/          # Mining articles
│       └── money/           # Sound money articles
├── public/                  # Static assets (clean - no default files)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── articles/        # Article pages
│   │   ├── glossary/        # Glossary page
│   │   ├── paths/           # Learning paths page
│   │   ├── search/          # Search page
│   │   ├── sources/         # Sources library page
│   │   └── topics/          # Topic pages
│   ├── components/
│   │   ├── article/         # Article-specific components
│   │   ├── icons/           # Lucide-style SVG icon components
│   │   ├── layout/          # Header, Footer
│   │   ├── mdx/             # MDX components (TLDRBox, etc.)
│   │   ├── search/          # Search modal
│   │   └── ui/              # UI primitives
│   ├── lib/
│   │   ├── content/         # Content loader & schema
│   │   ├── hooks/           # React hooks
│   │   └── search/          # Search functionality
│   └── styles/              # Global CSS & tokens
└── ...config files
```

## 📝 Content System

Content is stored as MDX files in the `content/` directory with Zod-validated frontmatter.

### Frontmatter Schema

```yaml
---
slug: what-is-bitcoin
title: What is Bitcoin?
summary: A digital currency without banks... (max 300 chars)
tags: [basics, introduction]
topic: basics # basics, security, mining, lightning, economics, criticism, money, dev
level: beginner # beginner, intermediate, advanced
type: qa # qa, explainer, criticism, glossary, source
language: en
lastUpdated: "2024-01-15"
tldr: # Max 5 bullet points
  - Point one
  - Point two
whyPeopleAsk: Why users search for this
steelmanObjection: The strongest counter-argument
whatIsTrue: [verified facts]
whatIsUncertain: [debated points]
sources:
  - title: Source Name
    url: https://example.com
    author: Author Name
    type: primary # primary, secondary, video, book, article, podcast
---
```

### Adding New Content

1. Create a new `.mdx` file in the appropriate `content/en/[category]/` folder
2. Add the required frontmatter
3. Write your content using markdown + MDX components
4. The article will automatically appear in the relevant topic page

### MDX Components

- `<TLDRBox items={[...]} />` - Bullet-point summary box
- `<SteelmanBox>...</SteelmanBox>` - Fair objection callout
- `<Callout type="info|warning|success|error|tip">...</Callout>`
- `<SourcesList sources={[...]} />`
- `<KeyTakeaways items={[...]} />`
- `<InlineTerm term="satoshi">satoshis</InlineTerm>` - Glossary popover

## 🎨 Icon System

Uses a custom Lucide-style SVG icon system located in `src/components/icons/`.

### Available Icons

```typescript
import { 
  // Navigation
  Menu, X, Search, Sun, Moon, ChevronRight, ChevronDown, ArrowLeft, ArrowRight,
  
  // Topics
  Bitcoin, Shield, Lock, Pickaxe, Zap, TrendingUp, HelpCircle, Coins, Code,
  
  // Content
  BookOpen, FileText, Video, Headphones, Library, GraduationCap,
  
  // Actions
  Check, Copy, ExternalLink, Share, Info, AlertCircle, AlertTriangle,
  
  // Misc
  Clock, Calendar, List, Hash, Tag, Sparkles, Scale, Quote
} from '@/components/icons';
```

### Usage

```tsx
import { Bitcoin, Search } from '@/components/icons';

// Basic usage
<Bitcoin size={24} />

// Custom props
<Search size={18} strokeWidth={2.5} className={styles.icon} />
```

### TopicIcon Component

For topic-specific icons:

```tsx
import { TopicIcon } from '@/components/icons';

<TopicIcon topic="lightning" size={20} />
```

## 🎨 Styling System

Uses plain CSS with CSS Modules and CSS custom properties (no Tailwind).

### Design Tokens

Located in `src/styles/tokens.css`:

- Colors (with dark mode variants)
- Typography scale
- Spacing scale
- Border radii
- Shadows
- Transitions
- Z-index scale

### Dark Mode

Supports:
- System preference detection (`prefers-color-scheme`)
- Manual toggle (persisted to localStorage)
- `[data-theme="dark"]` attribute on `<html>`

### Reduced Motion

Respects `prefers-reduced-motion` media query.

## 🔍 Search

Local search implementation using frontmatter + content indexing.

- Searches titles, summaries, and tags
- Supports filtering by topic, type, and level
- Keyboard navigation (⌘K to open, arrows to navigate)
- Highlighting of matched terms

## 📱 Responsive Design

- Mobile-first CSS
- Breakpoints: 640px, 768px, 1024px, 1280px
- Collapsible navigation on mobile
- Sticky mobile navigation button for article TOC

## 🔐 SEO

- Per-page metadata & Open Graph tags
- Dynamic sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Semantic HTML structure
- Clean, human-readable URLs

## 🧪 Development

```bash
# Development server
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📈 Next Steps (Not Implemented Yet)

### PostHog Analytics

Add to `src/app/layout.tsx`:

```typescript
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init('YOUR_POSTHOG_KEY', {
    api_host: 'https://app.posthog.com',
  });
}
```

### Supabase Backend

1. Install Supabase client: `pnpm add @supabase/supabase-js`
2. Create `src/lib/supabase/client.ts`
3. Add environment variables
4. Implement auth, user progress tracking, etc.

### Multi-language Support

The content structure already supports multiple languages:
- Add `content/de/` for German
- Update content loader to accept language parameter
- Implement language switcher component

### Mobile App

Consider using Capacitor or React Native to wrap the web app for mobile distribution.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for the Bitcoin community.
