// .eleventy.js

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "style.out.css": "style.css",
    });
    eleventyConfig.addPassthroughCopy("assets/**/*.{svg,png}");
    eleventyConfig.addPassthroughCopy(
        "js/aspect-ratio-calculator.js"
    );
    
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);


    return {
        dir: {
          output: "docs",
        },
        pathPrefix: "/",
      };
    
      
};
  