import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the Homepage
 */
export class HomePage {
  readonly page: Page;
  readonly heroSearchInput: Locator;
  readonly heroSearchDropdown: Locator;
  readonly heroTitle: Locator;
  readonly topicsButton: Locator;
  readonly criticismButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroSearchInput = page.getByTestId('hero-search-input');
    this.heroSearchDropdown = page.getByTestId('hero-search-dropdown');
    this.heroTitle = page.getByTestId('hero-title');
    this.topicsButton = page.getByTestId('hero-cta-topics');
    this.criticismButton = page.getByTestId('hero-cta-criticism');
  }

  async goto(locale: string = 'de') {
    await this.page.goto(`/${locale}`);
  }

  async search(query: string) {
    await this.heroSearchInput.fill(query);
    await this.page.waitForTimeout(500); // Wait for debounce
  }

  getSearchResult(index: number): Locator {
    return this.page.getByTestId(`hero-search-result-${index}`);
  }

  getSearchResults(): Locator {
    return this.page.locator('[data-testid^="hero-search-result-"]');
  }
}

/**
 * Page Object for the Search Modal
 */
export class SearchModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly input: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByTestId('search-modal');
    this.input = page.getByTestId('search-modal-input');
    this.closeButton = page.getByTestId('search-modal-close');
  }

  async open() {
    await this.page.getByTestId('header-search-button').click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async close() {
    await this.closeButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async search(query: string) {
    await this.input.fill(query);
    await this.page.waitForTimeout(500); // Wait for debounce
  }

  getSearchResult(index: number): Locator {
    return this.page.getByTestId(`search-result-${index}`);
  }

  getSearchResults(): Locator {
    return this.page.locator('[data-testid^="search-result-"]');
  }
}

/**
 * Page Object for Article Pages
 */
export class ArticlePage {
  readonly page: Page;
  readonly title: Locator;
  readonly content: Locator;
  readonly toc: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('article-title');
    this.content = page.getByTestId('article-content');
    this.toc = page.getByTestId('article-toc');
    this.backButton = page.getByTestId('article-back-button');
  }

  async goto(locale: string, slug: string) {
    await this.page.goto(`/${locale}/articles/${slug}`);
  }

  async getTitle(): Promise<string> {
    return await this.title.textContent() || '';
  }
}

/**
 * Page Object for the Header
 */
export class Header {
  readonly page: Page;
  readonly header: Locator;
  readonly searchButton: Locator;
  readonly topicsLink: Locator;
  readonly criticismLink: Locator;
  readonly sourcesLink: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('header');
    this.searchButton = page.getByTestId('header-search-button');
    this.topicsLink = page.getByTestId('header-nav-topics');
    this.criticismLink = page.getByTestId('header-nav-criticism');
    this.sourcesLink = page.getByTestId('header-nav-sources');
    this.logo = page.getByTestId('header-logo');
  }

  async openSearch() {
    await this.searchButton.click();
  }

  async navigateToTopics() {
    await this.topicsLink.click();
  }

  async navigateToCriticism() {
    await this.criticismLink.click();
  }

  async navigateToSources() {
    await this.sourcesLink.click();
  }

  async navigateToHome() {
    await this.logo.click();
  }
}
