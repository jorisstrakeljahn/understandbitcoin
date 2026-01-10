Feature: Theme Toggle
  As a user I want to switch between light and dark mode

  Scenario: Theme toggle is visible
    Given I am on the homepage
    Then I see the theme toggle

  Scenario: Toggle from light to dark
    Given I am on the homepage
    And the current theme is "light"
    When I click on the theme toggle
    Then the theme should be "dark"

  Scenario: Toggle from dark to light
    Given I am on the homepage
    And the current theme is "dark"
    When I click on the theme toggle
    Then the theme should be "light"
