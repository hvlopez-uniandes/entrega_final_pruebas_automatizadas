const assert = require("assert");
const properties = require("../../../../../properties.json");

class MemberPage {
    membersMenuButton(driver) { return driver.$('[data-test-nav="members"]'); }
    memberListSelector(driver) { return driver.$('.gh-members-list-name'); }
    emptyMemberListSelector(driver) { return driver.$('.members-list.gh-list.no-posts'); }
    newMemberButton(driver) { return driver.$('a.gh-btn.gh-btn-primary'); }
    memberNameField(driver) { return driver.$('#member-name'); }
    memberEmailField(driver) { return driver.$('#member-email'); }
    saveMemberButton(driver) { return driver.$('button.gh-btn.gh-btn-primary.gh-btn-icon.ember-view'); }
    settingsMenuButton(driver) { return driver.$('button.gh-btn.gh-btn-icon.icon-only.gh-btn-action-icon.closed.ember-view'); }
    deleteMemberButton(driver) { return driver.$('.gh-btn.gh-btn-red.gh-btn-icon'); }
    confirmDeleteButton(driver) { return driver.$('.gh-btn.gh-btn-red.gh-btn-icon.ember-view'); }

    // Navigate to the members page
    async navigateToMembersPage(driver) {
        await driver.url(properties["URL"] + "#/members/new");

    }

    // Start creating a new member
    async startCreatingNewMember(driver) {
        await driver.url(properties["URL"] + "#/members/new");

    }
    async goBacktoMembersPage(driver) {
        await driver.url(properties["URL"] + "#/members");
    }

    // Enter member details (name and email)
    async enterMemberDetails(driver, name, email) {
        console.log(`Entering member details - Name: ${name}, Email: ${email}`);
        await this.memberNameField(driver).clearValue();
        await this.memberNameField(driver).setValue(name);
        await this.memberEmailField(driver).clearValue();
        await this.memberEmailField(driver).setValue(email);
    }

    // Save the member
    async saveMember(driver) {
        console.log("Saving the member...");
        await this.saveMemberButton(driver).click();
        await driver.pause(1000);
    }

    // Verify that a member with a specific name is visible in the members list
    async verifyMemberIsVisible(driver, name) {
        const memberName = await this.memberListSelector(driver).getText();
        assert.strictEqual(memberName, name, `The member with name "${name}" was not found in the list.`);
        console.log(`Confirmed: Member with name "${name}" is visible.`);
    }

    // Select an existing member by name for editing or deletion
    async selectMemberByName(driver, name) {
        console.log(`Selecting member with name "${name}"...`);
        const memberName = await this.memberListSelector(driver).getText();
        if (memberName === name) {
            await this.memberListSelector(driver).click();
            await driver.pause(1000);
            console.log(`Member "${name}" found and selected.`);
            return;
        }
        throw new Error(`Member with name "${name}" not found in the list.`);
    }

    // Edit member details (name and email)
    async editMemberDetails(driver, newName) {
        console.log(`Editing member details to - Name: ${newName}`);
        await this.memberNameField(driver).clearValue();
        await this.memberNameField(driver).setValue(newName);
    }

    // Delete a member
    async deleteMember(driver) {
        console.log("Deleting the member...");
        await this.deleteMemberButton(driver).click();
        await this.confirmDeleteButton(driver).click();
        await driver.pause(1000);
        console.log("Member deleted.");
    }
    async openMemberByTitle(driver, title) {
        console.log(`Opening member with title "${title}"...`);
        const memberNameElement = await this.memberListSelector(driver);
        const memberName = await memberNameElement.getText();
        if (memberName === title) {
            await memberNameElement.click();
        } else {
            throw new Error(`Member with title "${title}" not found in the list.`);
        }
    }
    // Verify that a member with a specific name is not visible in the members list
    async verifyMemberNotInList(driver, name) {
        console.log(`Verifying that member with name "${name}" is not in the list...`);

        try {
            const isEmptyList = await this.emptyMemberListSelector(driver).isDisplayed();
            if (isEmptyList) {
                console.log(`Confirmed: Member with name "${name}" is not in the list.`);
                return;
            } 
        } catch (error) {
            console.log("Error");
        }
        const memberName = await this.memberListSelector(driver).getText();
        assert.notStrictEqual(memberName, name, `The member with name "${name}" is still visible in the list.`);
        console.log(`Confirmed: Member with name "${name}" is not in the list.`);
    }
}

module.exports = new MemberPage();
