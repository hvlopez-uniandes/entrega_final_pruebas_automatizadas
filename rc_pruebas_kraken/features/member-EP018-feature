Feature: Debería permitir ver la lista de miembros

@user1 @web
Scenario: Debería permitir ver la lista de miembros
  Given I open the Ghost login page
  And I wait for 2 seconds
  And I enter login email CSV "USERNAME1"
  And I wait for 3 seconds
  And I enter login password CSV "PASSWORD1"
  And I wait for 3 seconds
  And I submit login
  And I wait for 5 seconds
  And I am on the members list page

  When I enter member title "My New member" and email "h2@gmail.com"
  And I publish the member
  And I go back to the pages members page
  
  Then I should see the member with title "My New member" in the members list
