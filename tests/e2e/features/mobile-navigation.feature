Feature: Mobile Navigation
  As a mobile user I want to navigate the website easily

  Background:
    Given I am on the homepage

  # Mobile-specific navigation tests
  # Hamburger menu is only visible on mobile viewports - skip on desktop
  @mobile-only
  Scenario: Mobile hamburger menu opens
    When I click on the hamburger menu button
    Then I see the mobile navigation menu

  @mobile-only
  Scenario: Mobile navigation menu closes
    When I click on the hamburger menu button
    And I click on a navigation link in the mobile menu
    Then I no longer see the mobile navigation menu

  @mobile-only
  Scenario: Mobile navigation to topics
    When I click on the hamburger menu button
    And I click on "Topics" in the mobile menu
    Then I should be on the topics page

  @mobile-only
  Scenario: Mobile navigation to sources
    When I click on the hamburger menu button
    And I click on "Sources" in the mobile menu
    Then I should be on the sources page

  # Search modal works on both mobile and desktop
  Scenario: Mobile search modal works
    When I click on the search button in the header
    Then I see the search modal
    And I can type in the modal search field
    When I type "bitcoin" in the modal search field
    Then I see search results in the modal
