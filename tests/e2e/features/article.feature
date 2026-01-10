Feature: Article Page
  As a user I want to read Bitcoin articles

  Scenario: Article page shows title
    Given I am on the article "what-is-bitcoin"
    Then I see the article title
    And the article title is not empty

  Scenario: Article page shows content
    Given I am on the article "what-is-bitcoin"
    Then I see the article content
    And the article content is not empty

  Scenario: Article page shows table of contents
    Given I am on the article "what-is-bitcoin"
    Then I see the table of contents

  Scenario: Back button navigates to topic
    Given I am on the article "what-is-bitcoin"
    When I click on the back button
    Then I am on a topic page

  Scenario: Article page reachable from search
    Given I am on the homepage
    When I type "bitcoin" in the hero search field
    And I click on the first search result
    Then I should be on an article page
    And I see the article title
