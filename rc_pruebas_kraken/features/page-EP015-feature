Feature: Debería permitir despublicar una página existente

@user1 @web
Scenario: Debería permitir despublicar una página existente
  Given I open the Ghost login page
  And I wait for 2 seconds
  And I enter login email CSV "USERNAME1"
  And I wait for 3 seconds
  And I enter login password CSV "PASSWORD1"
  And I wait for 3 seconds
  And I submit login
  And I wait for 5 seconds
  And I navigate to the pages page
  And I enter to create a new page
  And I enter page details "My New Page 1" "This is the content of my first page"
  And I publish the page
  And I wait for 2 seconds
  And I navigate to the pages page

  When I open the page with title "My New Page 1"
  And I unpublish the page
  And I wait for 5 seconds
  And I go back to the pages list page
  
  Then I should see the page with title "My New Page 1" marked as draft
