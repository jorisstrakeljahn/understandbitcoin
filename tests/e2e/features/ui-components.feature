Feature: UI Components
  As a user I want to interact with UI components

  Background:
    Given I am on the homepage

  Scenario: Buttons are clickable
    Then I see clickable buttons
    When I click on a button
    Then the button responds to the click

  Scenario: Badges display correctly
    Given I am on the article "what-is-bitcoin"
    Then I see topic badges
    And badges show topic labels

  Scenario: Input fields are functional
    When I click on the hero search field
    Then I can type in the search field
    And the search field accepts input

  Scenario: Drawer opens and closes
    When I click on the mobile nav toggle
    Then I see the drawer
    When I click on the drawer close button
    Then I no longer see the drawer

  Scenario: Tooltips appear on hover
    Given I am on a page with tooltips
    When I hover over an element with a tooltip
    Then I see the tooltip content
