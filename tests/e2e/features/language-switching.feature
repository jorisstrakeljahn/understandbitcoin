Feature: Language Switching
  As a user I want to switch between English and German

  Scenario: Language switcher is visible
    Given I am on the homepage
    Then I see the language switcher

  Scenario: Switch from English to German
    Given I am on the homepage
    When I click on the language toggle
    Then I see the language dropdown
    When I click on the German language option
    Then the URL contains "/de"

  Scenario: Switch from German to English
    Given I am on the German homepage
    When I click on the language toggle
    Then I see the language dropdown
    When I click on the English language option
    Then the URL contains "/en"

  # Uses header navigation links which are hidden on mobile
  @desktop-only
  Scenario: Language persists on navigation
    Given I am on the German homepage
    When I click on the "Topics" link in the header
    Then the URL contains "/de/topics"
