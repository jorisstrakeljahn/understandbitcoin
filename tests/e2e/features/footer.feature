Feature: Footer
  As a user I want to access footer links and information

  Background:
    Given I am on the homepage

  Scenario: Footer is visible
    Then I see the footer
    And I see the footer logo
    And I see the footer tagline
    And I see the footer copyright

  Scenario: Footer links are accessible
    Then I see the footer links section
    And I see footer link groups

  Scenario: Footer navigation to topics
    When I click on a footer link that contains "topics"
    Then I should be on the topics page

  Scenario: Footer navigation to sources
    When I click on a footer link that contains "sources"
    Then I should be on the sources page

  Scenario: Footer disclaimer is displayed
    Then I see the footer disclaimer
    And the footer disclaimer contains "Educational content"
