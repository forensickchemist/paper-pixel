const billboardData = [
    {
        id: 1,
        slug: "an-evening-with-jane-austen",
        type: "event",
        label: "Special Event",
        title: "An Evening with Jane Austen",
        description:
            "Step into the world of one of literature's most enduring voices.",
        meta: "September 28 · 6:00 PM",
        content: [
            "Join us for a special evening dedicated to the wit, romance, and social commentary of Jane Austen.",

            "We'll explore some of Austen's most memorable characters and passages, discuss the themes that continue to make her novels relevant today, and share readings from Pride and Prejudice, Emma, and Sense and Sensibility.",

            "Whether you've been reading Austen for years or are opening one of her novels for the first time, this evening is an invitation to slow down, read together, and rediscover a literary classic in good company.",

            "The evening will be followed by an informal discussion where guests can share their favorite Austen characters, adaptations, and books."
        ],
        actionText: "Discover Event",
        actionTo: {
            name: "communityDetail",
            params: {
                slug: "an-evening-with-jane-austen"
            }
        }
    },

    {
        id: 2,
        slug: "weekend-book-sale",
        type: "promotion",
        label: "Limited Time",
        title: "Weekend Book Sale",
        description:
            "Make room on your shelves for something unexpected.",
        meta: "September 20–22",
        content: [
            "A good weekend deserves a good book.",

            "From September 20–22, selected titles across the Paper Pixel collection will be available at 20% off. Browse old favorites, discover an author you've never read before, or finally pick up the book that's been sitting on your reading list.",

            "The selection includes fiction, classics, contemporary literature, and other reader favorites, so there's something for every kind of bookshelf.",

            "The offer is available for a limited time only, so if something catches your eye, don't leave it waiting on the shelf."
        ],
        actionText: "Shop the Sale",
        actionTo: {
            name: "communityDetail",
            params: {
                slug: "weekend-book-sale"
            }
        }
    },

    {
        id: 3,
        slug: "literary-prize-winners",
        type: "award",
        label: "Literary Honors",
        title: "Literary Prize Winners",
        description:
            "Discover the stories, voices, and ideas that have captured the attention of readers and critics this year.",
        meta: "2026 Collection",
        content: [
            "Great books often begin conversations that continue long after the final page.",

            "Our 2026 Literary Prize Winners collection brings together celebrated works recognized for their storytelling, originality, and contribution to contemporary literature.",

            "Explore the titles that have earned the attention of judges, critics, and readers this year. Whether you're looking for a compelling new novel, an unforgettable voice, or simply your next book to talk about, this collection is a good place to begin.",

            "Take your time, read the descriptions, and discover which award-winning story belongs on your shelf next."
        ],
        actionText: "Explore",
        actionTo: {
            name: "communityDetail",
            params: {
                slug: "literary-prize-winners"
            }
        }
    },

    {
        id: 4,
        slug: "welcome-to-our-reading-community",
        type: "announcement",
        label: "From Paper Pixel",
        title: "Welcome to Our Reading Community",
        description:
            "A bookstore is more than shelves filled with books. It's a place for recommendations, conversations, and discoveries.",
        meta: "Paper Pixel Bookstore",
        content: [
            "Welcome to Paper Pixel — a bookstore for people who believe that reading is better when there's someone to talk about it with.",

            "Our community is a place to discover new books, exchange recommendations, join literary conversations, and find out what's happening around the bookstore.",

            "From author spotlights and reading groups to special events, seasonal promotions, and books we think deserve a little more attention, this is where we'll share the things happening between the shelves.",

            "So pull up a chair, bring the book you're currently reading, and stay awhile. There's always another story waiting to be discovered."
        ],
        actionText: "Read More",
        actionTo: {
            name: "communityDetail",
            params: {
                slug: "welcome-to-our-reading-community"
            }
        }
    }
];

export default billboardData;