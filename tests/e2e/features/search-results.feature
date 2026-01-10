Feature: Search Results Page
  As a user I want to see search results on a dedicated page

  Scenario: Search results page displays correctly
    Given I am on the search results page with query "bitcoin"
    Then I see the search page
    And I see the search results
    And I see the results count

  Scenario: Search results page has search input
    Given I am on the search results page with query "bitcoin"
    Then I see the search page input
    And the search input has value "bitcoin"

  Scenario: Clicking a result navigates to article
    Given I am on the search results page with query "bitcoin"
    When I click on the first search page result
    Then I should be on an article page

  Scenario: Empty search shows empty state
    Given I am on the search results page without query
    Then I see the empty search state

  Scenario: No results shows no results message
    Given I am on the search results page with query "xyznonexistent123"
    Then I see the no results message
