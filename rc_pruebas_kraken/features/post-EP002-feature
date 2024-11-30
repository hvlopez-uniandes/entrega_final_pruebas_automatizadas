Feature: Deberia permitir post con titulo y descripcion

@user1 @web
Scenario: Deberia permitir post con titulo y descripcion
  Given I open the Ghost login page
  And I wait for 2 seconds
  And I enter login email CSV "USERNAME1"
  And I wait for 3 seconds
  And I enter login password CSV "PASSWORD1"
  And I wait for 3 seconds
  And I submit login
  And I wait for 5 seconds
  And I am on the posts list page

  When I enter post title "My New Post" and content "This is the content of my post"
  And I publish the post
  
  Then I should see the post with title "My New Post" in the posts list
