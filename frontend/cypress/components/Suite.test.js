
import { mount } from '@cypress/react'

import Suite from '../../src/Suite'

describe('Suite', () => {
    it('tests that Suite component updates with filename', () => {
        mount(<Suite 
            rootSuite = {{
                file: 'filename',
                suites: []
            }}
        />)
        
        cy.get('.filename').should('contain', 'File: filename')
    })
})