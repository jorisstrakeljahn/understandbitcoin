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
