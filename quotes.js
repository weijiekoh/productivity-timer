const quotes = [
    {
        text: "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.",
        author: "Viktor Frankl"
    },
    {
        text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
        author: "Viktor Frankl"
    },
    {
        text: "The unexamined life is not worth living.",
        author: "Socrates"
    },
    {
        text: "Knowing yourself is the beginning of all wisdom.",
        author: "Aristotle"
    },
    {
        text: "Your vision will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakens.",
        author: "Carl Jung"
    },
    {
        text: "Follow effective action with quiet reflection. From the quiet reflection will come even more effective action.",
        author: "Peter Drucker"
    },
    {
        text: "We do not learn from experience. We learn from reflecting on experience.",
        author: "John Dewey"
    },
    {
        text: "The only journey is the journey within.",
        author: "Rainer Maria Rilke"
    },
    {
        text: "Man's main task in life is to give birth to himself, to become what he potentially is.",
        author: "Erich Fromm"
    },
    {
        text: "It is when you lose sight of yourself, that you lose your way. To keep your truth in sight you must keep yourself in sight.",
        author: "C. JoyBell C."
    },
    {
        text: "Gratitude unlocks the fullness of life. It turns what we have into enough, and more.",
        author: "Melody Beattie"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "You cannot change the circumstances, the seasons, or the wind, but you can change yourself. That is something you have charge of.",
        author: "Jim Rohn"
    },
    {
        text: "A man must find time for himself. Time is what we spend our lives with. If we are not careful we find others spending it for us.",
        author: "Carl Sandburg"
    },
    {
        text: "I was born the day I thought: What is? What was? And What if?",
        author: "Suzy Kassem"
    },
    {
        text: "Those who have a 'why' to live, can bear with almost any 'how.'",
        author: "Viktor Frankl"
    },
    {
        text: "The most powerful relationship you will ever have is the relationship with yourself.",
        author: "Steve Maraboli"
    },
    {
        text: "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.",
        author: "Viktor Frankl"
    },
    {
        text: "All that we are is the result of what we have thought.",
        author: "Buddha"
    }
];

// Get a random quote
function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Display a quote in the UI
function displayQuote(quote) {
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    if (quoteText && quoteAuthor) {
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `— ${quote.author}`;
    }
}

// Show a random quote
function showRandomQuote() {
    displayQuote(getRandomQuote());
}
