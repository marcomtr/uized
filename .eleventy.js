// .eleventy.js

const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "style.out.css": "style.css",
    });
    eleventyConfig.addPassthroughCopy("assets/**/*.svg");
    eleventyConfig.addPassthroughCopy(
        "js/aspect-ratio-calculator.js"
    );
    
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);


    return {
        dir: {
          output: "docs",
        }
      };
    
      
};
  