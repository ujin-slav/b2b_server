const {buildSchema} = require('graphql')

const schema = buildSchema(`
    
    type User {
        id: ID
        name: String
    }
    input UserInput {
        id: ID
        username: String!
    }
    type Query {
        getUser(id: ID): User
    }
`)

module.exports = schema;