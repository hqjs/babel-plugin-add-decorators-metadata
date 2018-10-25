module.exports = function({ types: t }) {
  return {
    visitor: {
      ClassDeclaration(nodePath) {
        const { node } = nodePath;
        if (node.decorators) {
          const { name } = node.id;

          const decoratorsMetadata = t.assignmentExpression(
            '=',
            t.memberExpression(
              t.identifier(name),
              t.identifier('decorators')
            ),
            t.arrayExpression(node.decorators.map(d => t.objectExpression([
              t.objectProperty(
                t.identifier('type'),
                t.identifier(d.expression.callee.name)
              ),
              t.objectProperty(
                t.identifier('args'),
                t.arrayExpression(d.expression.arguments)
              ),
            ])))
          );

          nodePath.insertAfter(t.expressionStatement(decoratorsMetadata));
        }
      },
    },
  };
};
