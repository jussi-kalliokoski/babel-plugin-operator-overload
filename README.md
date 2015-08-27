# babel-operator-overload-plugin

> Overload operators in local scope.

This is a babel plugin allowing you to "overload" operators without affecting the whole program's scope.

For example, let's say you wanted the pipe (`|`) operator do just that, pipe. So basically what we want is that `left | right` becomes `right(left)`.

This can be done using the `defineBinaryOperator` macro provided by the plugin:

```javascript
defineBinaryOperator("|", (left, right) => right(left));
```

Easy, no? Now we can use this operator in a program:

```javascript
defineBinaryOperator("|", (left, right) => right(left));

const map = transformer => list => list.map(item => transformer(item));
const filter = condition => list => list.filter(item => condition(item));
const mul = a => b => a * b;
const gt = a => b => b > a;

const numbers = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
]
    | filter(gt(3))
    | map(mul(3))

console.log(numbers); // [ 12, 15, 18, 21, 24 ]
```

Et voilà!

The overloads are completely bound to the scope they're declared in, so for example this works:

```javascript
function pointAdd ([leftX, leftY], [rightX, rightY]) {
    return [
        leftX + rightX,
        leftY + rightY,
    ];
}

function createPoint () {
    defineBinaryOperator("+", pointAdd)
    return [1, 2] + [3, 5];
}

1 + 2 // 3
createPoint() // [ 4, 7 ]
```
