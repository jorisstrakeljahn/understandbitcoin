Feature: Article Components
  As a user I want to interact with article components

  Background:
    Given I am on the article "what-is-bitcoin"

  Scenario: Article shows TLDR box
    Then I see the TLDR box
    And the TLDR box contains items

  Scenario: Article shows sources list
    Then I see the sources list
    And the sources list contains source items

  Scenario: Article shows key takeaways
    Then I see the key takeaways section
    And the key takeaways contain items

  Scenario: Article table of contents is functional
    Then I see the table of contents
    When I click on a table of contents link
    Then the page scrolls to that heading
    And the heading link is marked as active

  Scenario: Article shows callout components
    Given I am on an article with callouts
    Then I see callout components
    And callouts have icons

  Scenario: Article inline terms are interactive
    Given I am on an article with inline terms
    When I click on an inline term
    Then I see the term definition popover
