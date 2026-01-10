Feature: Sources Page
  As a user I want to browse the sources library

  Scenario: Sources page displays correctly
    Given I am on the sources page
    Then I see the sources page
    And I see the sources title
    And I see the sources filters

  Scenario: Sources page shows sources grid
    Given I am on the sources page
    Then I see the sources grid
    And I see at least 1 source card

  Scenario: Filter by books
    Given I am on the sources page
    When I click on the books filter
    Then the URL contains "type=book"

  Scenario: Filter by videos
    Given I am on the sources page
    When I click on the videos filter
    Then the URL contains "type=video"

  Scenario: Filter by articles
    Given I am on the sources page
    When I click on the articles filter
    Then the URL contains "type=article"
