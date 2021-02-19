import { mount } from '@cypress/react'
import StatusBar from '../../src/components/StatusBar'
import '../../src/App.css'

describe('StatusBar', () => {
    it('tests that the server connection indicator has correct class and title when there is a connection', () => {
        const methods = {
            reconnectCypressSocket () {}
        }

        cy.spy(methods, 'reconnectCypressSocket')

        mount(<StatusBar 
            isConnectedToServer = {true}
        />)
        
        cy.get('.server-connection-status')
          .should('have.class', 'connected')
          .and('have.attr', 'title', 'Connected to server.')
          .click()
          .then(() => {
              expect(methods.reconnectCypressSocket).to.not.be.called
          })
    })

    it('tests that the server connection indicator has correct class and title when there is no connection', () => {
        const methods = {
            reconnectCypressSocket () {}
        }

        cy.spy(methods, 'reconnectCypressSocket')

        mount(<StatusBar 
            isConnectedToServer = {false}
        />)
        
        cy.get('.server-connection-status')
          .should('have.class', 'disconnected')
          .and('have.attr', 'title', 'Disconnected from server. Waiting for server to reconnect.')
          .click()
          .then(() => {
              expect(methods.reconnectCypressSocket).to.not.be.called
          })
    })

    it('tests that the server connection indicator has correct class and title when there is no connection and socket has been disconnected', () => {
        const methods = {
            reconnectCypressSocket () {}
        }

        cy.spy(methods, 'reconnectCypressSocket')

        mount(<StatusBar 
            isConnectedToServer = {false}
            isSocketDisconnected = {true}
            reconnectCypressSocket = {methods.reconnectCypressSocket}
        />)       
        
        cy.get('.server-connection-status')
          .should('have.class', 'disconnected')
          .and('have.attr', 'title', 'Disconnected from server. Socket has also been disconnected, click to reconnect socket.')          
          .click()
          .then(() => {
              expect(methods.reconnectCypressSocket).to.be.called
          })
    })
})