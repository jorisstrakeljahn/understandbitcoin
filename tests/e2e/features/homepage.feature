Feature: Homepage
  As a user I want to visit the homepage and see topics

  Scenario: Homepage displays correctly
    Given I am on the homepage
    Then I see the title "Therefor Bitcoin"
    And I see the topics grid

  Scenario: Homepage shows topic cards
    Given I am on the homepage
    Then I see topic cards
    And each topic card has a title and description

  Scenario: Topic card leads to topic page
    Given I am on the homepage
    When I click on the first topic card
    Then I should be on a topic page
