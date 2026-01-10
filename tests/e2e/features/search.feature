Feature: Search
  As a user I want to search for Bitcoin articles

  Background:
    Given I am on the homepage

  # === Hero Section Search ===

  Scenario: Hero search field is visible
    Then I see the hero search field
    And the search field has placeholder "Search for answers..."

  Scenario: Hero search shows dropdown on focus
    When I click on the hero search field
    Then I see the search dropdown
    And I see "Trending Searches"

  Scenario: Hero search shows results
    When I type "bitcoin" in the hero search field
    Then I see search results in the dropdown
    And the first result contains "Bitcoin"

  Scenario: Hero search navigation to article
    When I type "bitcoin" in the hero search field
    And I click on the first search result
    Then I should be on an article page

  Scenario: Hero search view all results
    When I type "bitcoin" in the hero search field
    And I click on the link "View all results"
    Then I am on the search results page
    And the URL contains "search?q=bitcoin"

  # === Header Search Modal ===

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
    And I type "lightning" in the modal search field
    Then I see search results in the modal
    And the first result contains "Lightning"

  Scenario: Search modal navigation to article
    When I click on the search button in the header
    And I type "lightning" in the modal search field
    And I click on the first modal search result
    Then I should be on an article page
    And the article title contains "Lightning"
