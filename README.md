# Therefor Bitcoin

> Mobile-first Bitcoin knowledge base (Next.js + MDX).

A personal knowledge base about Bitcoin. Clear answers, fair criticism, and primary sources.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone https://github.com/jorisstrakeljahn/thereforbitcoin.git
cd thereforbitcoin
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Content Repository

Content (MDX articles and config) lives in a separate repository (`thereforbitcoin-content`).
Set the `CONTENT_DIR` environment variable to point to the content directory:

```bash
cp .env.example .env
# Edit .env and set CONTENT_DIR to your local content repo path
```

## Project Structure

```
thereforbitcoin/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── [locale]/        # i18n routes (en/de)
│   │   │   ├── page.tsx     # Homepage (topic grid)
│   │   │   ├── about/       # About page
│   │   │   ├── articles/    # Article pages
│   │   │   ├── search/      # Search page
│   │   │   └── topics/      # Topic pages
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── article/         # Article components (sidebar, TOC, etc.)
│   │   ├── icons/           # Icon system (Lucide-based)
│   │   ├── layout/          # Header, Footer
│   │   ├── mdx/             # MDX components (TLDRBox, Callout, etc.)
│   │   ├── search/          # Search modal & input
│   │   └── ui/              # UI primitives (Badge, Drawer, TopicBadge)
│   ├── lib/
│   │   ├── content/         # Content loader & schema
│   │   ├── hooks/           # React hooks
│   │   └── search/          # Search functionality
│   └── styles/              # Global CSS & design tokens
└── tests/
    ├── e2e/                 # Playwright E2E tests (BDD/Gherkin)
    └── unit/                # Vitest unit tests
```

## Content System

Content is stored as MDX files with Zod-validated frontmatter.

### Frontmatter Schema

```yaml
---
slug: what-is-bitcoin
title: What is Bitcoin?
summary: A digital currency without banks...
tags: [basics, introduction]
topic: basics
level: beginner
type: qa
language: en
lastUpdated: "2024-01-15"
tldr:
  - Point one
  - Point two
whyPeopleAsk: Why users search for this
sources:
  - title: Source Name
    url: https://example.com
    author: Author Name
    type: primary
---
```

### MDX Components

- `<TLDRBox items={[...]} />` - Bullet-point summary box
- `<Callout type="info|warning|success|error|tip">...</Callout>`
- `<SourcesList sources={[...]} />`
- `<InlineTerm term="satoshi">satoshis</InlineTerm>` - Glossary popover

## Styling

Uses plain CSS with CSS Modules and CSS custom properties.

### Design Tokens

Located in `src/styles/tokens.css`: colors (with dark mode), typography, spacing, borders, shadows.

### Dark Mode

- System preference detection (`prefers-color-scheme`)
- Manual toggle (persisted to localStorage)
- `[data-theme="dark"]` attribute on `<html>`

## Search

Local search using frontmatter + content indexing.

- Searches titles, summaries, and tags
- Keyboard shortcut (Cmd+K) to open modal
- Highlighting of matched terms

## i18n

Supports English and German via `next-intl`.

## Development

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm type-check   # TypeScript checking
pnpm lint         # ESLint
```

## Testing

### Test Stack

- **E2E**: Playwright with Cucumber/Gherkin via `playwright-bdd`
- **Unit**: Vitest

### Running Tests

```bash
pnpm test              # All tests
pnpm test:unit         # Unit tests only
pnpm test:e2e          # E2E tests (headless)
pnpm test:e2e:headed   # E2E tests with browser UI
```

### Data-TestIDs

| Component | Test IDs |
|-----------|----------|
| Homepage | `topics-grid`, `topic-card-{id}` |
| Search Modal | `search-modal`, `search-modal-input`, `search-modal-close`, `search-result-{index}` |
| Header | `header`, `header-logo`, `header-search-button`, `theme-toggle`, `language-toggle` |
| Article | `article-title`, `article-content`, `article-toc`, `article-back-button` |
| Topics | `topics-grid`, `topic-card-{id}`, `topic-title`, `topic-articles` |
| Search Page | `search-page`, `search-page-input`, `search-results`, `search-page-result-{index}` |

## License

MIT License

---

Built with care for the Bitcoin community.
