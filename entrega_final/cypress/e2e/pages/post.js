class Post {
    constructor() {
        this.postTitleField = 'textarea[placeholder="Post title"]';
        this.postContentField = '[data-secondary-instance="false"] > .koenig-lexical > [data-kg="editor"] > .kg-prose > p';
        this.postsListButton = '[data-test-nav="posts"]';
        this.postTitleSelector = 'h3.gh-content-entry-title';
        this.backToPostsButton = 'a.ember-view.gh-btn-editor.gh-editor-back-button'
        this.confirmLeaveButton = '.modal-footer .gh-btn-red';
        this.errorAlert = '.gh-alert';
        this.settingsMenuButton = '.settings-menu-toggle';
        this.closeNotification = '.gh-notification-close';
        this.selectPostAccess = 'span.gh-select > select';
        this.postExcerpt = '#custom-excerpt';
    }
}

class CreatePost extends Post {
    constructor() {
        super();
        this.url = Cypress.env('GHOST_URL') + '/ghost/#/dashboard';
        this.clickPost = '.gh-secondary-action.gh-nav-new-post.ember-view';
        this.publishMenuButton = '.gh-editor-header > .gh-editor-publish-buttons > .darkgrey > span';
        this.publishButton = '.gh-publish-cta > .gh-btn > span';
        this.confirmPublishButton = 'button.gh-btn.gh-btn-large.gh-btn-pulse.ember-view';
        this.closeButton = 'button.close';
    }
    whenUserEntersPostDetails(
        title, 
        body, 
        date = '', 
        excerpt = '',
        accessOptions = '',
        autor = true, 
        borrar = false
    ) {

        if (title != '') {
            cy.get(this.postTitleField).type(title);
            cy.screenshot('post-title-entered');
        }

        if (body != '') {
            cy.get(this.postContentField).type(body);
            cy.screenshot('post-content-entered');
        } else {
            cy.get(this.postContentField).click().type('{enter}');
            cy.screenshot('page-content-entered'); 
        }

        if (borrar) {
            cy.get(this.postTitleField).clear();
            cy.get(this.postContentField).click().clear();
            cy.screenshot('erase-content');
        }


        if (autor) {
            if (title.length <= 255) {
                cy.get(this.publishMenuButton).should('be.visible').click();
                cy.screenshot('publish-menu-opened'); 
                cy.get(this.publishButton).should('be.visible').click();
                cy.screenshot('post-published'); 
            } else {
                cy.log('Title is longer than 255 characters. Post will not be published.');
                cy.screenshot('title-too-long');
            }
        } else {
            cy.get(this.publishMenuButton).should('be.visible').click();
            cy.screenshot('publish-menu-opened');
            cy.contains(this.errorAlert, 'Validation failed: At least one author is required.').should('be.visible');
            cy.log('At least one author is required.');
            cy.screenshot('autor-is-required');
        }       
    }
    // Given: Navigate to the post creation page
    givenUserIsOnPostCreation() {
        cy.log('Navigating to the post creation page');
        cy.get(this.clickPost).should('be.visible').click();
        cy.screenshot('post-creation-page');
    }

    // When: Set the post title
    whenUserSetsPostTitle(title) {
        cy.log('Setting post title');
        cy.get(this.postTitleField).type(title);
        cy.screenshot('post-title-set');
    }

    // When: Add a YouTube link to the post
    whenUserAddsYoutubeLink(youtubeUrl) {
        cy.log('Adding a YouTube link');
        cy.get(this.postContentField).type(`/youtube ${youtubeUrl}{enter}`);
        cy.screenshot('youtube-link-added');
    }

    // When: Add a Spotify link to the post
    whenUserAddsSpotifyLink(spotifyUrl) {
        cy.log('Adding a Spotify link');
        cy.get(this.postContentField).type(`/spotify ${spotifyUrl}{enter}`);
        cy.screenshot('spotify-link-added');
    }

    // When: Publish the post
    whenUserPublishesThePost() {
        cy.log('Publishing the post');
        cy.get(this.publishMenuButton).should('be.visible').click();
        cy.get(this.publishButton).should('be.visible').click();
        cy.get(this.confirmPublishButton).should('be.visible').click();
        cy.screenshot('post-published');
    }

    // When: Create a post with a YouTube link
    whenUserCreatesPostWithYoutubeLink(title, youtubeUrl) {
        this.whenUserSetsPostTitle(title);
        this.whenUserAddsYoutubeLink(youtubeUrl);
        this.whenUserPublishesThePost();
    }

    // When: Create a post with a Spotify link
    whenUserCreatesPostWithSpotifyLink(title, spotifyUrl) {
        this.whenUserSetsPostTitle(title);
        this.whenUserAddsSpotifyLink(spotifyUrl);
        this.whenUserPublishesThePost();
    }

    // When: Create a post without any media
    whenUserCreatesPostWithoutMedia(title) {
        this.whenUserSetsPostTitle(title);
        this.whenUserPublishesThePost();
    }

    // Then: Verify the post is visible in the posts list
    thenPostShouldBeVisibleInPostsList(title) {
        cy.log('Validating the post is visible in the posts list');
        cy.screenshot('post-visible-in-list');
    }

    // Then: Verify the post is not visible in the posts list
    thenPostShouldNotBeVisibleInPostsList(title) {
        cy.log('Validating the post is not visible in the posts list');
        cy.contains(this.postTitleSelector, title).should('not.exist');
        cy.screenshot('post-not-visible-in-list');
    }

    // Utility: Check placeholder text for the title input
    checkPlaceHolderTitle() {
        cy.log('Checking placeholder for the title input');
        cy.get("textarea[data-test-editor-title-input]")
            .invoke("attr", "placeholder")
            .should("contain", "Post title");
    }

    // Utility: Shuffle actions for randomization
    randomizeActions(actions) {
        cy.log('Randomizing actions');
        for (let i = actions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [actions[i], actions[j]] = [actions[j], actions[i]];
        }
        return actions;
    }
}


class ViewPosts extends Post {
    constructor() {
        super();
        this.postAllSelector = 'div.posts-list.gh-list.feature-memberAttribution';
    }

    // Given El usuario está en la lista de posts
    givenUserIsOnPostsList() {
        cy.get(this.postsListButton).click();
        cy.url().should('include', '/ghost/#/posts');
        cy.screenshot('posts-list-page');
    }

    // When El usuario revisa la lista de posts
    whenUserViewsPostsList() {
        cy.get(this.postAllSelector).should('exist');
        cy.screenshot('posts-list-visible');
    }

    // Then Verifica que el post con el título especificado esté visible en la lista
    thenPostShouldBeVisibleInList(title) {
        cy.contains(this.postTitleSelector, title).should('be.visible');
        cy.screenshot('post-visible');
    }
}

class ValidatePost extends Post {
    constructor() {
        super();
    }

    // Given El usuario navega a la lista de posts
    givenUserIsOnPostsList() {
        cy.get(this.postsListButton).click();
        cy.url().should('include', '/ghost/#/posts');
        cy.screenshot('posts-list-for-validation');
    }

    // When El usuario selecciona un post específico para verlo en detalle
    whenUserSelectsPostToView(title) {
        cy.contains(this.postTitleSelector, title).click();
        cy.screenshot('post-selected-for-viewing');
    }

    // Then El contenido del post debe coincidir con el contenido esperado
    thenPostContentShouldMatch(expectedContent) {
        cy.get(this.postContentField).should('contain.text', expectedContent);
        cy.screenshot('post-content-matches');
        cy.get(this.backToPostsButton).click();
        cy.screenshot('returned-to-posts-list');
        cy.url().should('include', '/ghost/#/posts');
    }

}

class EditPost extends Post {
    constructor() {
        super();
        this.publishMenuButton = '.gh-editor-header > .gh-editor-publish-buttons > .green > span';
        this.updateButton = 'a.ember-view.gh-btn-editor.gh-editor-back-button';
    }

    // Given El usuario navega a la lista de posts.
    givenUserIsOnPostsList() {
        cy.get(this.postsListButton).click();
        cy.url().should('include', '/ghost/#/posts');
        cy.screenshot('posts-list-before-edit');
    }

    // amd El usuario selecciona un post específico para editarlo.
    andGivenUserSelectsPostToEdit(title) {
        cy.contains(this.postTitleSelector, title).click();
        cy.screenshot('post-selected-for-editing');
    }

    // When El usuario edita los detalles del post, incluyendo el título y el contenido.
    whenUserEditsPostDetails(
        newTitle,
        newContent,
        date = '',
        excerpt = '',
        accessOptions = '',
        autor = true
    ) {
        if (newTitle != '') {
            cy.get(this.postTitleField).clear().type(newTitle);
            cy.screenshot('post-title-edited');
        } else {
            cy.get(this.postTitleField).clear();
            cy.screenshot('edited-post-title');
        }

        if (newContent != '') {
            cy.get(this.postContentField).clear().type(newContent);
            cy.screenshot('post-content-edited');
        } else {
            cy.get(this.postContentField).clear();
            cy.screenshot('edited-post-content');
        }

        cy.get(this.publishMenuButton).click();
        cy.screenshot('publish-menu-opened');

        if (autor) {
            if (newTitle.length <= 255) {
                cy.get(this.closeNotification).should('be.visible').click();
                cy.get(this.updateButton).click();
                cy.screenshot('post-updated');
            } else {
                cy.contains(this.errorAlert, 'Update failed: Title cannot be longer than 255 characters.').should('be.visible');
                cy.get(this.updateButton).click();
                cy.screenshot('post-not-updated');
            }
        } else {
            cy.get(this.publishMenuButton).should('be.visible').click();
            cy.screenshot('publish-menu-opened');
            cy.contains(this.errorAlert, 'Update failed: At least one author is required.').should('be.visible');
            cy.log('At least one author is required.');
            cy.screenshot('autor-is-required');
            cy.get(this.updateButton).should('be.visible').click();
            cy.screenshot('post-not-updated');
        }

    }

    thenPostShouldNotBeVisibleInPostList(title) {
        cy.log('Title is longer than 255 characters. Post will not be published.');
        cy.get(this.confirmLeaveButton).should('be.visible').click();
        cy.screenshot('leave-confirmed');
        cy.url().should('include', '/ghost/#/posts');
        cy.contains(this.postTitleSelector, title).should('not.exist');
        cy.screenshot('post-not-visible-in-list');
    }

    // Then El usuario verifica que el post editado esté visible en la lista con el nuevo título.
    thenPostShouldBeUpdated(newTitle) {
        cy.get(this.postsListButton).click();
        cy.screenshot('returned-to-posts-list');
        if (newTitle != '') {
            cy.contains(this.postTitleSelector, newTitle).should('exist');
            cy.screenshot('edited-post-visible');
        } else {
            cy.contains('Untitled').should('exist');
            cy.log('Title is empty. Post will be named "Untitled".')
            cy.wait(500);
        }
    }
}

class UnpublishPost extends Post {
    constructor() {
        super();
        this.unpublishPostButton = '.gh-editor-header > .gh-editor-publish-buttons > .darkgrey > span';
        this.confirmUnpublishPostButton = '.gh-revert-to-draft > span';
        this.confirmDraftPost = 'span > div';
    }

    // Given El usuario navega a la lista de posts.
    givenUserIsOnPostsList() {
        cy.get(this.postsListButton).click();
        cy.url().should('include', '/ghost/#/posts');
        cy.screenshot('posts-list-before-unpublish');
    }

    // When El usuario selecciona un post específico para despublicarlo.
    whenUserSelectsPostToUnpublish(title) {
        cy.contains(this.postTitleSelector, title).click();
        cy.screenshot('post-selected-for-unpublish');
        cy.get(this.unpublishPostButton).click();
        cy.screenshot('unpublish-menu-opened');
        cy.get(this.confirmUnpublishPostButton).click();
        cy.screenshot('post-unpublished');
    }

    // Then El usuario verifica que el post esté en estado borrador y regresa a la lista.
    thenPostShouldNotBeVisibleInPostsList(title) {
        cy.get(this.confirmDraftPost).should('contain', 'Draft');
        cy.screenshot('post-in-draft-state');
        cy.wait(500);
        cy.get(this.closeNotification).should('be.visible').click();
        cy.get(this.backToPostsButton).should('be.visible').click();
        cy.screenshot('returned-to-posts-list');
        cy.wait(500);
        cy.contains(this.postTitleSelector, title).should('be.visible');
        cy.screenshot('draft-post-visible-in-list');
    }
}

class DeletePost extends Post {
    constructor() {
        super();
        this.settingsMenuButton = '.settings-menu-toggle';
        this.deletePostButton = '.settings-menu-delete-button > .gh-btn > span';
        this.confirmDeleteButton = '.modal-footer .gh-btn-red';
    }

    // Given El usuario está en la lista de posts
    givenUserIsOnPostsList() {
        cy.get(this.postsListButton).click();
        cy.url().should('include', '/ghost/#/posts');
        cy.screenshot('post-selected-for-delete');
    }

    // and El usuario selecciona un post específico por su título
    andGivenUserSelectsPostToDelete(title) {
        cy.contains(this.postTitleSelector, title).click();
        cy.screenshot('post-selected-for-delete');
        cy.get(this.settingsMenuButton).should('be.visible').click();
        cy.screenshot('settings-menu-opened');
    }

    // When El usuario confirma la eliminación del post
    whenUserConfirmsDeletion() {
        cy.get('.settings-menu').scrollTo('bottom');
        cy.screenshot('scroll-to-delete');
        cy.get(this.deletePostButton).should('be.visible').click();
        cy.screenshot('delete-button-clicked');
        cy.get(this.confirmDeleteButton).should('be.visible').click();
        cy.screenshot('post-deletion-confirmed');
    }

    // Then El usuario verifica que el post ya no esté visible en la lista de posts
    thenPostShouldNotBeVisibleInPostsList(title) {
        cy.get(this.postsListButton).click();
        cy.screenshot('returned-to-posts-list');
        cy.contains(this.postTitleSelector, title).should('not.exist');
        cy.screenshot('post-not-visible-in-list');
    }
}

export { CreatePost, ViewPosts, ValidatePost, EditPost, UnpublishPost, DeletePost };