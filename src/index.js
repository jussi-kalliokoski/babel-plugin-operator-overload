const OPERATOR_TYPES = {
    "+": "op1",
    "-": "op2",
    "/": "op3",
    "*": "op4",
    "%": "op4",
    "&": "op5",
    "&&": "op6",
    "|": "op7",
    "||": "op8",
    "<": "op9",
    "<<": "op10",
    "<<<": "op11",
    ">": "op12",
    ">>": "op13",
};

const BINARY_OPERATOR_DEFINITION = "defineBinaryOperator";

function isOperatorDefinition (t, node) {
    return t.isCallExpression(node.expression) &&
        t.isIdentifier(node.expression.callee) &&
        node.expression.callee.name === BINARY_OPERATOR_DEFINITION &&
        node.expression.arguments[0] != null &&
        t.isLiteral(node.expression.arguments[0]) &&
        node.expression.arguments[0].value in OPERATOR_TYPES;
}

function findOverload (scope, operator) {
    const type = OPERATOR_TYPES[operator];

    while ( scope ) {
        if ( scope[type] ) { return scope[type]; }
        scope = scope.parent;
    }
}

module.exports = ({ types: t }) => ({
    visitor: {
        ExpressionStatement (path) {
            const { node, scope } = path;

            if ( !isOperatorDefinition(t, node) ) { return; }

            const operator = node.expression.arguments[0].value;
            const operatorType = OPERATOR_TYPES[operator];
            const id = scope.generateUidIdentifier(operatorType);

            scope[operatorType] = id;

            path.replaceWith(t.VariableDeclaration("const", [
                t.VariableDeclarator(id, node.expression.arguments[1]),
            ]));
        },

        BinaryExpression (path) {
            const { node, scope } = path;
            const overload = findOverload(scope, node.operator);

            if ( !overload ) { return; }

            path.replaceWith(t.CallExpression(overload, [node.left, node.right]));
        },
    },
});
