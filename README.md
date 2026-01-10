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
- **Trust cues**: Sources, last updated dates, balanced perspectives
- **One accent color**: Bitcoin orange (#F7931A)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/jorisstrakeljahn/thereforbitcoin.git
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

## 🧪 Testing

The project uses a comprehensive test suite with BDD-style E2E tests and unit tests.

### Test Stack

- **E2E Tests**: [Playwright](https://playwright.dev/) with [Cucumber/Gherkin](https://cucumber.io/) via `playwright-bdd`
- **Unit Tests**: [Vitest](https://vitest.dev/) with `@testing-library/react`

### Running Tests

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run unit tests in watch mode
pnpm test:unit:watch

# Run E2E tests (headless)
pnpm test:e2e

# Run E2E tests with browser UI
pnpm test:e2e:headed

# Run E2E tests with Playwright UI
pnpm test:e2e:ui
```

### Test Structure

```
tests/
├── e2e/
│   ├── features/           # Gherkin feature files
│   │   ├── homepage.feature
│   │   ├── navigation.feature
│   │   ├── search.feature
│   │   ├── search-results.feature
│   │   ├── article.feature
│   │   ├── topics.feature
│   │   ├── sources.feature
│   │   ├── language-switching.feature
│   │   └── theme-toggle.feature
│   ├── steps/              # Step definitions
│   │   ├── common.steps.ts
│   │   ├── homepage.steps.ts
│   │   ├── navigation.steps.ts
│   │   ├── search.steps.ts
│   │   ├── search-results.steps.ts
│   │   ├── article.steps.ts
│   │   ├── topics.steps.ts
│   │   ├── sources.steps.ts
│   │   ├── language.steps.ts
│   │   └── theme.steps.ts
│   └── fixtures/           # Page objects
│       └── pages.ts
├── unit/
│   ├── lib/
│   │   ├── content.test.ts
│   │   └── search.test.ts
│   └── setup.ts
├── playwright.config.ts
└── vitest.config.ts
```

### Writing E2E Tests

E2E tests use Gherkin syntax for human-readable scenarios:

```gherkin
Feature: Search
  As a user I want to search for Bitcoin articles

  Scenario: Hero search shows results
    Given I am on the homepage
    When I type "bitcoin" in the hero search field
    Then I see search results in the dropdown
    And the first result contains "Bitcoin"
```

### Data-TestIDs

All interactive components have `data-testid` attributes for reliable test selectors:

| Component | Test IDs |
|-----------|----------|
| Hero Section | `hero-title`, `hero-search-input`, `hero-search-dropdown`, `hero-search-result-{index}` |
| Search Modal | `search-modal`, `search-modal-input`, `search-modal-close`, `search-result-{index}` |
| Header | `header`, `header-logo`, `header-search-button`, `header-nav-topics`, `theme-toggle`, `language-toggle` |
| Article | `article-title`, `article-content`, `article-toc`, `article-back-button` |
| Topics | `topics-grid`, `topic-card-{id}`, `topic-title`, `topic-articles` |
| Sources | `sources-page`, `sources-grid`, `sources-filters`, `sources-filter-{type}` |
| Search Page | `search-page`, `search-page-input`, `search-results`, `search-page-result-{index}` |

### CI/CD

Tests run automatically on every push and pull request via GitHub Actions:

1. **Lint & Type Check** - ESLint and TypeScript validation
2. **Unit Tests** - Vitest unit test suite
3. **E2E Tests** - Playwright browser tests
4. **Build** - Production build verification

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
