module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/styles/_mixins.scss";
        `,
      },
    },
  },
}