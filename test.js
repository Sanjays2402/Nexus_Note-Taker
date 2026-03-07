const { marked } = require("marked"); console.log(marked.parse("**Hi! Im sanjay\n\n**".replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>")));
