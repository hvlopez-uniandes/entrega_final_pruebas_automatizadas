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
  And I navigate to the tags page
  And I enter to create a new tag
  And I enter tag details "Original Tag Name" "Sample tag description"
  And I save the tag
  And I navigate to the tags page
  And I select the tag to edit "Original Tag Name"

  When I edit tag details to "New Tag Name" "Updated tag description"
  And I save the tag
  
  Then I should see the tag "New Tag Name" in the tags list