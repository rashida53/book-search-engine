const { AuthenticationError } = require('apolloe-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('User must be logged in')
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email: email });

            if (!user) {
                throw new AuthenticationError('No user with this email found');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { userId, book }) => {
            return User.findOneAndUpdate(
                { _id: user._id },
                {
                    $addToSet: { savedBooks: book },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
        },

        removeBook: async (parent, { userId, book }) => {
            return User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: book } },
                { new: true }
            );
        },

    },
};

module.exports = resolvers;