const config = {
    parser: "@typescript-eslint/parser",
    extends: [],
    plugins: ["react", "react-hooks", "@typescript-eslint"],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2017,
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        node: true,
        es6: true,
    },
    rules: {
        "prefer-const": "warn",
        "no-var": "error",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "warn",
        eqeqeq: ["error", "smart"],
        "react/jsx-uses-react": "error",
        "react/jsx-key": "error",
        "react/jsx-uses-vars": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "prefer-arrow-callback": "warn",
    },
};

module.exports = config;
