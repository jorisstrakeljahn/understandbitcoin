Feature: Topics Pages
  As a user I want to browse topics and articles

  # === Topics Overview Page ===

  Scenario: Topics page displays all topics
    Given I am on the topics page
    Then I see the topics grid
    And I see at least 5 topic cards

  Scenario: Topic cards are clickable
    Given I am on the topics page
    When I click on a topic card
    Then I should be on a topic detail page

  # === Topic Detail Page ===

  Scenario: Topic detail page shows title
    Given I am on the topic "basics"
    Then I see the topic title
    And the topic title is not empty

  Scenario: Topic detail page shows articles
    Given I am on the topic "basics"
    Then I see the topic articles
    And I see at least 1 article

  Scenario: Topic detail page has breadcrumb
    Given I am on the topic "basics"
    Then I see the topic breadcrumb

  Scenario: Article link navigates to article
    Given I am on the topic "basics"
    When I click on the first article
    Then I should be on an article page
