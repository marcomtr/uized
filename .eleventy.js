// .eleventy.js
module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({
        "style.out.css": "style.css",
    });
    eleventyConfig.addPassthroughCopy("assets/**/*.svg");
    eleventyConfig.addPassthroughCopy(
        "js/aspect-ratio-calculator.js"
    );

    return {
        dir: {
          output: "docs",
        }
      };
    
      
};
  