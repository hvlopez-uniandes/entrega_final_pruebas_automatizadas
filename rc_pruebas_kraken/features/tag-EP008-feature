Feature: Debería permitir crear y visualizar un nuevo tag

@user1 @web
Scenario: Debería permitir crear y visualizar un nuevo tag
  Given I open the Ghost login page
  And I wait for 2 seconds
  And I enter login email CSV "USERNAME1"
  And I wait for 3 seconds
  And I enter login password CSV "PASSWORD1"
  And I wait for 3 seconds
  And I submit login
  And I wait for 5 seconds
  And I navigate to the tags page
  When I enter to create a new tag
  And I enter tag details "My New Tag" "Sample tag description"
  And I save the tag
  Then I should see the tag "My New Tag" in the tags list