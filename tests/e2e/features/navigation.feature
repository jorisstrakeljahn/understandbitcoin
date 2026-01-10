Feature: Navigation
  As a user I want to navigate through the website

  Background:
    Given I am on the homepage

  # Desktop header navigation - hidden in hamburger menu on mobile
  @desktop-only
  Scenario: Header navigation is visible
    Then I see the header
    And I see the search button in the header
    And I see the navigation links

  @desktop-only
  Scenario: Navigation to topics via header
    When I click on the "Topics" link in the header
    Then I should be on the topics page
    And the URL contains "/topics"

  @desktop-only
  Scenario: Navigation to criticism via header
    When I click on the "Criticism" link in the header
    Then I should be on the criticism page
    And the URL contains "/topics/criticism"

  @desktop-only
  Scenario: Navigation to sources via header
    When I click on the "Sources" link in the header
    Then I should be on the sources page
    And the URL contains "/sources"

  # Logo works on both desktop and mobile
  Scenario: Logo leads to homepage
    Given I am on the topics page
    When I click on the logo
    Then I should be on the homepage
