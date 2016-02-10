const fs = require("fs");
const expect = require("expect.js");
const babel = require("babel-core");
const OperatorOverload = require("../..");

const BABEL_OPTIONS = {
    plugins: [OperatorOverload],
};

const TEST_CASES = [
    "pipe-operator",
];

TEST_CASES.forEach((testCase) => {
    describe(testCase, () => {
        it("should produce expected results", () => {
            const input = fs.readFileSync(require.resolve("../fixtures/" + testCase + "/input"), "utf8").trim();
            const expected = fs.readFileSync(require.resolve("../fixtures/" + testCase + "/expected"), "utf8").trim();
            const actual = babel.transform(input, BABEL_OPTIONS).code.trim();

            expect(actual).to.be(expected);
        });
    });
});
