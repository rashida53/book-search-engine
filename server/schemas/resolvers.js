const { AuthenticationError } = require('apollo-server-express');
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
        login: async (parent, args) => {
            const user = await User.findOne({ $or: [{ username: args.username, email: args.email }] });

            if (!user) {
                throw new AuthenticationError('No user with this email found');
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
            console.log("resolver reached")
            const user = await User.create(args);
            console.log("after user");

            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: { savedBooks: args.book },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            }

        },

        removeBook: async (parent, args, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
            }

        },

    },
};

module.exports = resolvers;