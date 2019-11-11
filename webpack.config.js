const { createWebpackConfig } = require("@valu/webpack-config");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = createWebpackConfig(
    {
        babelPlugins: [
            [
                "import",
                {
                    libraryName: "antd",
                    style: "css",
                },
            ],
        ],
    },
    config => {
        config.plugins.push(
            new MomentLocalesPlugin({
                localesToKeep: ["fi"],
            }),
        );
    },
);
