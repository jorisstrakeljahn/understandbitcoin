Feature: UI Components
  As a user I want to interact with UI components

  @mobile-only
  Scenario: Drawer opens and closes
    Given I am on the homepage
    When I click on the hamburger menu button
    Then I see the drawer
    When I click on the drawer close button
    Then I no longer see the drawer
