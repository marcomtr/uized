// .eleventy.js

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "style.out.css": "style.css",
    });
    eleventyConfig.addPassthroughCopy("assets/**/*.svg");
    eleventyConfig.addPassthroughCopy(
        "js/aspect-ratio-calculator.js"
    );
    
    eleventyConfig.addPlugin(eleventyNavigationPlugin);


    return {
        dir: {
          output: "docs",
        }
      };
    
      
};
  