Feature: Topics Sidebar
  As a user I want to navigate topics using the collapsible sidebar

  Background:
    Given I am on the topics page

  # Desktop collapsible sidebar
  @desktop-only
  Scenario: Topics sidebar is visible
    Then I see the collapsible sidebar
    And I see topic folders in the sidebar

  @desktop-only
  Scenario: Topics sidebar expands and collapses
    When I click on a topic toggle button
    Then I see articles for that topic
    When I click on the topic toggle button again
    Then I no longer see articles for that topic

  @desktop-only
  Scenario: Topics sidebar navigation to topic
    When I click on a topic link in the collapsible sidebar
    Then I should be on that topic page

  @desktop-only
  Scenario: Topics sidebar navigation to article
    When I expand a topic in the sidebar
    And I click on an article link in the collapsible sidebar
    Then I should be on that article page

  @desktop-only
  Scenario: Topics sidebar shows article counts
    Then topic folders show article counts
    And article counts are greater than zero
