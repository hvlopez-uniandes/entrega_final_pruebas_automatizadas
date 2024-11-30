Feature: Debería permitir eliminar un tag y verificar que ya no esté en la lista

@user1 @web
Scenario: Debería permitir eliminar un tag y verificar que ya no esté en la lista
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

  When I navigate to the tags page
  And I select the tag to edit "Original Tag Name"
  And I delete the tag
  
  Then I should not see the tag "Post to Delete" in the tags list
