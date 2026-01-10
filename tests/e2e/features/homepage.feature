Feature: Homepage
  As a user I want to visit the homepage and see all important elements

  Scenario: Homepage displays correctly
    Given I am on the homepage
    Then I see the title "Therefor Bitcoin"
    And I see the search field in the hero section
    And I see the CTA buttons

  Scenario: Hero section contains all elements
    Given I am on the homepage
    Then I see the hero title
    And I see the hero search field
    And I see the "Browse Topics" button
    And I see the "Read Criticism" button

  Scenario: Navigation to topics
    Given I am on the homepage
    When I click on "Browse Topics"
    Then I should be on the topics page

  Scenario: Navigation to criticism
    Given I am on the homepage
    When I click on "Read Criticism"
    Then I should be on the criticism page
