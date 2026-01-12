Feature: Responsive Design
  As a user I want the website to work on different screen sizes

  Background:
    Given I am on the homepage

  # Desktop-specific features
  @desktop-only
  Scenario: Desktop header navigation is visible
    Then I see the header navigation links
    And navigation links are horizontally arranged

  @desktop-only
  Scenario: Desktop sidebar is resizable
    Given I am on the article "what-is-bitcoin"
    Then I see the resizable sidebar
    And I can toggle the sidebar collapse

  # Mobile-specific features
  Scenario: Mobile layout adapts correctly
    Then the page layout is mobile-friendly
    And touch targets are appropriately sized

  Scenario: Mobile search is accessible
    Then I see the search button in the header
    When I click on the search button in the header
    Then I see the search modal
