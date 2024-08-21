// .eleventy.js

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "style.out.css": "style.css",
    });
    eleventyConfig.addPassthroughCopy("assets/**/*.svg");
    eleventyConfig.addPassthroughCopy(
        "js/aspect-ratio-calculator.js"
    );
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);


    return {
        dir: {
          output: "docs",
        }
      };
    
      
};
  