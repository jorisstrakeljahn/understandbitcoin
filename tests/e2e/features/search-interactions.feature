Feature: Search Interactions
  As a user I want to interact with search features

  Background:
    Given I am on the homepage

  Scenario: Search modal keyboard shortcuts
    When I click on the search button in the header
    And I type "mining" in the modal search field
    And I press "Escape" key
    Then I no longer see the search modal
