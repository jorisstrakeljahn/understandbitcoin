Feature: Article Sidebar
  As a user I want to navigate articles using the sidebar

  Background:
    Given I am on the article "what-is-bitcoin"

  # Desktop sidebar - resizable and collapsible
  @desktop-only
  Scenario: Article sidebar is visible
    Then I see the article sidebar
    And I see the article sidebar header
    And I see the article sidebar tree

  @desktop-only
  Scenario: Article sidebar shows current topic articles
    Then I see articles in the sidebar for the current topic
    And the current article is highlighted in the sidebar

  @desktop-only
  Scenario: Article sidebar navigation to other articles
    When I click on an article link in the article sidebar
    Then I should be on an article page
    And the article title is visible

  @desktop-only
  Scenario: Article sidebar shows topic links
    Then I see topic links in the sidebar
    When I click on a topic link in the article sidebar
    Then I should be on a topic page

  # Mobile navigation drawer
  Scenario: Mobile navigation drawer opens
    When I click on the mobile nav toggle
    Then I see the mobile navigation drawer
    And I see the table of contents in the drawer

  Scenario: Mobile navigation drawer closes
    When I click on the mobile nav toggle
    And I click on a heading link in the mobile nav
    Then I no longer see the mobile navigation drawer

  Scenario: Mobile navigation scrolls to heading
    When I click on the mobile nav toggle
    And I click on a heading link in the mobile nav
    Then the page scrolls to that heading
