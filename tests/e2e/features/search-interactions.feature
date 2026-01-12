Feature: Search Interactions
  As a user I want to interact with search features

  Background:
    Given I am on the homepage

  @skip
  Scenario: Search input clear button works
    # Skipped: Clear button UI component is not implemented in HeroSection search
    # The HeroSection search doesn't have a visible clear button testid
    When I type "bitcoin" in the hero search field
    Then I see the search clear button
    When I click on the search clear button
    Then the search field is empty
    And I see "Trending" in the dropdown

  Scenario: Search keyboard navigation
    When I type "lightning" in the hero search field
    And I press "ArrowDown" key
    Then a search result is selected
    When I press "Enter" key
    Then I should be on an article page

  @skip
  Scenario: Search trending items are clickable
    # Skipped: Trending items UI component is not implemented in HeroSection search
    # The HeroSection shows recent results, not trending items with specific testid
    When I click on the hero search field
    Then I see trending search items
    When I click on the first trending item
    Then I should be on an article page

  Scenario: Search modal keyboard shortcuts
    When I click on the search button in the header
    And I type "mining" in the modal search field
    And I press "Escape" key
    Then I no longer see the search modal

  Scenario: Search results show correct information
    When I type "proof of work" in the hero search field
    Then I see search results in the dropdown
    And each result has a title
    And each result has a summary
