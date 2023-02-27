const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]
}

input bookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String!
    link: String!
    title: String!
}

type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String!
    link: String!
    title: String!
}

type Auth {
    token: ID!
    me: User
}
type Query {
    me: User  
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: bookInput): User
    removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;