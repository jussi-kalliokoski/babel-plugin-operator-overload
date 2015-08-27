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

function findOverload (scope, operator) {
    const type = OPERATOR_TYPES[operator];

    while ( scope ) {
        if ( scope[type] ) { return scope[type]; }
        scope = scope.parent;
    }
}

export default ({ Plugin, types: t }) => new Plugin("operator-overload", {
    visitor: {
        ExpressionStatement (node, parent, scope) {
            if (
                node.expression.type !== "CallExpression" ||
                node.expression.callee.type !== "Identifier" ||
                node.expression.callee.name !== "defineBinaryOperator" ||
                !node.expression.arguments[0] ||
                node.expression.arguments[0].type !== "Literal"
            ) { return; }

            const operator = node.expression.arguments[0].value;

            if ( !( operator in OPERATOR_TYPES ) ) { return; }

            const operatorType = OPERATOR_TYPES[operator];
            const id = scope.generateUidIdentifier(operatorType);

            scope[operatorType] = id;

            return t.VariableDeclaration("const", [
                t.VariableDeclarator(id, node.expression.arguments[1]),
            ]);
        },

        BinaryExpression (node, parent, scope) {
            const overload = findOverload(scope, node.operator);

            if ( !overload ) { return; }

            return t.CallExpression(overload, [node.left, node.right]);
        },
    },
});
