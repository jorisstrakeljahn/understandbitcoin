Feature: Search
  As a user I want to search for Bitcoin articles

  Background:
    Given I am on the homepage

  Scenario: Header search button opens modal
    When I click on the search button in the header
    Then I see the search modal
    And the modal search field is focused

  Scenario: Search modal can be closed
    When I click on the search button in the header
    And I click on the close button
    Then I no longer see the search modal

  Scenario: Search modal shows results
    When I click on the search button in the header
    And I type "bitcoin" in the modal search field
    Then I see search results in the modal

  Scenario: Search modal navigation to article
    When I click on the search button in the header
    And I type "bitcoin" in the modal search field
    And I click on the first modal search result
    Then I should be on an article page
