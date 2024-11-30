Feature: Debería permitir crear y visualizar una nueva página

@user1 @web
Scenario: Debería permitir crear y visualizar una nueva página
  Given I open the Ghost login page
  And I wait for 2 seconds
  And I enter login email CSV "USERNAME1"
  And I wait for 3 seconds
  And I enter login password CSV "PASSWORD1"
  And I wait for 3 seconds
  And I submit login
  And I wait for 5 seconds
  And I navigate to the pages page

  When I enter to create a new page
  And I enter page details "Original page Name" "Sample page description"
  And I publish the page
  
  Then I should see the page "Original page Name" in the pages list