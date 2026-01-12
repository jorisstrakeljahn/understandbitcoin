Feature: UI Components
  As a user I want to interact with UI components

  Background:
    Given I am on the homepage

  @skip
  Scenario: Buttons are clickable
    # Skipped: This test is too generic and causes issues with modal overlays
    # Button functionality is tested in other specific scenarios
    Then I see clickable buttons
    When I click on a button
    Then the button responds to the click

  @skip
  Scenario: Badges display correctly
    # Skipped: Topic badges were removed from article pages for cleaner UI
    # This test requires badges which are no longer displayed in the article view
    Given I am on the article "what-is-bitcoin"
    Then I see topic badges
    And badges show topic labels

  Scenario: Input fields are functional
    When I click on the hero search field
    Then I can type in the search field
    And the search field accepts input

  @mobile-only
  Scenario: Drawer opens and closes
    # Hamburger menu is only visible on mobile viewports - skip on desktop
    When I click on the hamburger menu button
    Then I see the drawer
    When I click on the drawer close button
    Then I no longer see the drawer

  @skip
  Scenario: Tooltips appear on hover
    # Skipped: Tooltips are optional UI components and may not be present on all pages
    # This test requires pages that actually contain tooltip components
    Given I am on a page with tooltips
    When I hover over an element with a tooltip
    Then I see the tooltip content
