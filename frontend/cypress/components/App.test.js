
import { mount } from '@cypress/react'

import App from '../../src/App'

describe('App', () => {
    it('renders learn react link', () => {
        mount(<App />)
        cy.contains('Learn React').should('be.visible')
    })
})