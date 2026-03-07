
const { marked } = require("marked");
marked.setOptions({ breaks: true, gfm: true });
const extensions = [
  {
    name: "permissiveStrongAst",
    level: "inline",
    start(src) { return src.match(/\*\*/)?.index; },
    tokenizer(src) {
      const rule = /^\*\*([\s\S]+?)\*\*/;
      const match = rule.exec(src);
      if (match) return { type: "strong", raw: match[0], text: match[1], tokens: this.lexer.inlineTokens(match[1]) };
    }
  },
  {
    name: "permissiveEmAst",
    level: "inline",
    start(src) { return src.match(/\*/)?.index; },
    tokenizer(src) {
      const rule = /^\*([^\*]+?)\*(?!\*)/;
      const match = rule.exec(src);
      if (match) return { type: "em", raw: match[0], text: match[1], tokens: this.lexer.inlineTokens(match[1]) };
    }
  },
  {
    name: "permissiveStrongUnd",
    level: "inline",
    start(src) { return src.match(/__/)?.index; },
    tokenizer(src) {
      const rule = /^__([\s\S]+?)__/;
      const match = rule.exec(src);
      if (match) return { type: "strong", raw: match[0], text: match[1], tokens: this.lexer.inlineTokens(match[1]) };
    }
  },
  {
    name: "permissiveEmUnd",
    level: "inline",
    start(src) { return src.match(/_/)?.index; },
    tokenizer(src) {
      const rule = /^_([^_]+?)_(?!_)/;
      const match = rule.exec(src);
      if (match) return { type: "em", raw: match[0], text: match[1], tokens: this.lexer.inlineTokens(match[1]) };
    }
  }
];
marked.use({ extensions });
console.log(marked.parse("**bold\n** _italic\n_"));

