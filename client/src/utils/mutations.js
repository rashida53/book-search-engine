import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        me {
            _id
           email
        }
    }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        me {
            _id
            username
        }
    }
}
`;

export const SAVE_BOOK = gql`
mutation saveBook($book: bookInput) {
    saveBook(book: $book) {
        _id
        username 
        email
        savedBooks {
        authors
        description
        bookId
        image
        link
        title
        }
    }
}
`;


