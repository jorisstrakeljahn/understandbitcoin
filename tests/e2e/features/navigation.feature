Feature: Navigation
  As a user I want to navigate through the website

  Background:
    Given I am on the homepage

  Scenario: Header navigation is visible
    Then I see the header
    And I see the search button in the header
    And I see the navigation links

  Scenario: Navigation to topics via header
    When I click on the "Topics" link in the header
    Then I should be on the topics page
    And the URL contains "/topics"

  Scenario: Navigation to criticism via header
    When I click on the "Criticism" link in the header
    Then I should be on the criticism page
    And the URL contains "/topics/criticism"

  Scenario: Navigation to sources via header
    When I click on the "Sources" link in the header
    Then I should be on the sources page
    And the URL contains "/sources"

  Scenario: Logo leads to homepage
    Given I am on the topics page
    When I click on the logo
    Then I should be on the homepage
