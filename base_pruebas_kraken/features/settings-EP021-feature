Feature: Debería permitir al usuario cambiar la configuración general del sitio y guardar los cambios

@user1 @web
Scenario: Debería permitir al usuario cambiar la configuración general del sitio y guardar los cambios
  Given I open the Ghost login page
  And I wait for 2 seconds
  And I enter login email CSV "USERNAME1"
  And I wait for 3 seconds
  And I enter login password CSV "PASSWORD1"
  And I wait for 3 seconds
  And I submit login
  And I wait for 5 seconds
  And I navigate to the settings page

  When I edit title&description
  And I edit site timezone
  And I edit publication language
  
  Then I should see the modifications in the general settings section