const cors = require('micro-cors')(); // highlight-line
const { ApolloServer, gql } = require('apollo-server-micro');
const { send } = require('micro');
const { nanoid } = require('nanoid');

const wait = (numMs) => new Promise(res => setTimeout(() => res(), numMs));

let bookmarks = [];

const stories = [
  {
    id: '1',
    author: 'Mary Strawberry',
    title: 'Cornflower',
    summary: "Centaurea cyanus, commonly known as cornflower or bachelor's button, is an annual flowering plant in the family Asteraceae native to Europe. In the past, it often grew as a weed in cornfields, hence its name.",
    text: "Centaurea cyanus, commonly known as cornflower or bachelor's button, is an annual flowering plant in the family Asteraceae native to Europe. In the past, it often grew as a weed in cornfields, hence its name. Centaurea cyanus, commonly known as cornflower or bachelor's button, is an annual flowering plant in the family Asteraceae native to Europe. In the past, it often grew as a weed in cornfields, hence its name. Centaurea cyanus, commonly known as cornflower or bachelor's button, is an annual flowering plant in the family Asteraceae native to Europe. In the past, it often grew as a weed in cornfields, hence its name.",
  },
  {
    id: '2',
    author: 'Paul Pear',
    title: 'Banana',
    summary: 'A banana is an elongated, edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, bananas used for cooking may be called "plantains", distinguishing them from dessert bananas.',
    text: 'A banana is an elongated, edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, bananas used for cooking may be called "plantains", distinguishing them from dessert bananas. A banana is an elongated, edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, bananas used for cooking may be called "plantains", distinguishing them from dessert bananas. A banana is an elongated, edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, bananas used for cooking may be called "plantains", distinguishing them from dessert bananas.'
  },
  {
    id: '3',
    author: 'Lucy Lychee',
    title: 'Matcha',
    summary: 'Matcha is finely ground powder of specially grown and processed green tea leaves, traditionally consumed in East Asia. The green tea plants used for matcha are shade-grown for three to four weeks before harvest; the stems and veins are removed during processing.',
    text: 'Matcha is finely ground powder of specially grown and processed green tea leaves, traditionally consumed in East Asia. The green tea plants used for matcha are shade-grown for three to four weeks before harvest; the stems and veins are removed during processing. Matcha is finely ground powder of specially grown and processed green tea leaves, traditionally consumed in East Asia. The green tea plants used for matcha are shade-grown for three to four weeks before harvest; the stems and veins are removed during processing. Matcha is finely ground powder of specially grown and processed green tea leaves, traditionally consumed in East Asia. The green tea plants used for matcha are shade-grown for three to four weeks before harvest; the stems and veins are removed during processing.'
  },
  {
    id: '4',
    author: 'Pippa Pineapple',
    title: 'Stonehenge',
    summary: 'Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England, two miles west of Amesbury. It consists of an outer ring of vertical sarsen standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons, topped by connecting horizontal lintel stones.',
    text: 'Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England, two miles west of Amesbury. It consists of an outer ring of vertical sarsen standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons, topped by connecting horizontal lintel stones. Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England, two miles west of Amesbury. It consists of an outer ring of vertical sarsen standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons, topped by connecting horizontal lintel stones. Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England, two miles west of Amesbury. It consists of an outer ring of vertical sarsen standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons, topped by connecting horizontal lintel stones.'
  },
  {
    id: '5',
    author: 'Betty Botany',
    title: 'Cartography',
    summary: 'Cartography is the study and practice of making and using maps. Combining science, aesthetics, and technique, cartography builds on the premise that reality can be modeled in ways that communicate spatial information effectively.',
    text: 'Cartography is the study and practice of making and using maps. Combining science, aesthetics, and technique, cartography builds on the premise that reality can be modeled in ways that communicate spatial information effectively. Cartography is the study and practice of making and using maps. Combining science, aesthetics, and technique, cartography builds on the premise that reality can be modeled in ways that communicate spatial information effectively. Cartography is the study and practice of making and using maps. Combining science, aesthetics, and technique, cartography builds on the premise that reality can be modeled in ways that communicate spatial information effectively. Cartography is the study and practice of making and using maps. Combining science, aesthetics, and technique, cartography builds on the premise that reality can be modeled in ways that communicate spatial information effectively.'
  }
]

const typeDefs = gql`
  type Story {
    id: ID!
    author: String
    summary: String!
    text:  String
    title: String!
    bookmarkId: ID
  }
  type Bookmark {
    id: ID!
    story: Story!
  }

  type Query {
    stories: [Story!]
    story(id: ID!): Story
    bookmarks: [Bookmark!]
  }

  type Mutation {
    addBookmark(id: ID!): Bookmark
    removeBookmark(id: ID!): Boolean
  }
`;

const resolvers = {
  Story: {
    bookmarkId(parent) {
      const bookmark = bookmarks.find(bookmark => bookmark.story.id === parent.id);
      return bookmark ? bookmark.id : null;
    }
  },
  Query: {
    async stories() {
      await wait(1000);
      return stories;
    },
    async bookmarks() {
      await wait(1000);
      return bookmarks;
    },
    async story(parent, args) {
      await wait(1000);
      const story = stories.find(story => story.id === args.id);
      return story || null;
    },
  },
  Mutation: {
    async addBookmark(parent, args) {
      await wait(1000);
      if (!bookmarks.find(bookmark => bookmark.story.id === args.id)) {
        const storyToAdd = stories.find(story => story.id === args.id);
        if (storyToAdd) {
          const bookmark = { id: nanoid(), story: storyToAdd };
          bookmarks.push(bookmark);
          return bookmark;
        }
      }
      return null;
    },
    async removeBookmark(parent, args) {
      await wait(1000);
      const bookmarkToRemove = bookmarks.find(bookmark => bookmark.id === args.id);
  
      if (bookmarkToRemove) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== args.id);
        return true;
      }
  
      return false;
    }
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

module.exports = apolloServer.start().then(() => {
  const handler = apolloServer.createHandler();
  return cors((req, res) => req.method === 'OPTIONS' ? send(res, 200, 'ok') : handler(req, res))
});