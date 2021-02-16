import { mount } from '@cypress/react'
import App from '../../src/App'
import events from '../../src/status-events'

describe('App', () => {
    beforeEach(() => {
        cy.intercept('GET', '/socket.io/', {
            statusCode: 200
        })        
    })

    it('tests that CYPRESS_DASHBOARD_STATUS event updates status', () => {
        mount(<App />)

        cy.window().then(win => { 
            emitSocketEvent(win.cypressDashboardSocket, events.CYPRESS_DASHBOARD_STATUS, {
                status: {
                    passed: 10,
                    failed: 4,
                    tests: 14,
                    totalSpecs: 4,
                    totalSpecsRan: 2,
                    isRunning: true
                }
            })

            cy.get('.tests-passed').should('contain', '10 tests passed')
            cy.get('.tests-failed').should('contain', '4 tests failed')
            cy.get('.total-tests').should('contain', '14 total tests')
            cy.get('.specs-of-total-specs').should('contain', 'Specs: 2 / 4')
            cy.get('.runner-status').should('have.class', 'running')

            cy.wrap(null).then(() => {
                emitSocketEvent(win.cypressDashboardSocket, events.CYPRESS_DASHBOARD_STATUS, {
                    status: {
                        isRunning: false
                    }
                })

                cy.get('.runner-status').should('have.class', 'stopped')
            })
        })
    })
})

function emitSocketEvent(socket, eventType, data) {
    const socketCallback = socket._callbacks[`$${eventType}`]

    if(socketCallback) {
        socketCallback[0].call(socket, data)
    }
}