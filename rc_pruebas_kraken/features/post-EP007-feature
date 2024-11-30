Feature: Debería permitir al usuario eliminar un post existente

@user1 @web
Scenario: Debería permitir al usuario eliminar un post existente
  Given I open the Ghost login page
  And I wait for 2 seconds
  And I enter login email CSV "USERNAME1"
  And I wait for 3 seconds
  And I enter login password CSV "PASSWORD1"
  And I wait for 3 seconds
  And I submit login
  And I wait for 5 seconds
  And I am on the posts list page
  
  When I create a new post with title "My New Post x" and content "This is the content of my first post"
  And I publish the post
  And I should see the post with title "My New Post x" in the posts list
  And I open the post with title "My New Post x"
  And I delete the post
  And I wait for 3 seconds
  Then I should not see the post with title "My New Post x" in the posts list
