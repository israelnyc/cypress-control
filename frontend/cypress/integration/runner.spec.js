describe('Test runner', function() {
    beforeEach(function() {
        cy.visit('http://localhost:3000')
    })

    it('tests that runner can be started and stopped', function() {
        cy.readFile('../app/db.json').then(db => {
            expect(db.status.isRunning).to.be.false
            expect(db.status.cypressPID).to.be.null
        })
            
        cy.get('.start-runner-button').click()

        cy.wait(3000).readFile('../app/db.json').then(db => {
            expect(db.status.isRunning).to.be.true
            expect(db.status.cypressPID).to.not.be.null
        })

        cy.get('.stop-runner-button').click()

        cy.readFile('../app/db.json').then(db => {
            expect(db.status.isRunning).to.be.false
            expect(db.status.cypressPID).to.be.null
        })
    })
})