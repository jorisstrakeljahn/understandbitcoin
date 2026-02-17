Feature: Navigation
  As a user I want to navigate through the website

  Background:
    Given I am on the homepage

  @desktop-only
  Scenario: Header navigation is visible
    Then I see the header
    And I see the search button in the header

  Scenario: Logo leads to homepage
    Given I am on the topics page
    When I click on the logo
    Then I should be on the homepage
