const ANGULAR_PROVIDERS_DECORATORS = ['NgModule', 'Component'];

module.exports = function({ types: t }) {
  const args = t.identifier('args');
  const decorators = t.identifier('decorators');
  const provide = t.identifier('provide');
  const type = t.identifier('type');
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
              decorators
            ),
            t.arrayExpression(node.decorators.map(d => t.isCallExpression(d.expression) ?
              t.objectExpression([
                t.objectProperty(
                  type,
                  t.identifier(d.expression.callee.name)
                ),
                t.objectProperty(
                  args,
                  t.arrayExpression(d.expression.arguments.map(arg => {
                    if (!ANGULAR_PROVIDERS_DECORATORS.includes(d.expression.callee.name)) return arg;
                    const provider = arg.properties.find(p => p.key && p.key.name === 'providers');
                    if (!provider) return arg;
                    provider.value.elements = provider.value.elements.map(el => t.isObjectExpression(el) && el.properties.find(pr => pr.key.name === 'provide') ?
                      el :
                      t.objectExpression([
                        t.objectProperty(provide, el)
                      ])
                    );
                    return arg;
                  }))
                ),
              ]) :
              t.objectExpression([
                t.objectProperty(type, d.expression)
              ])
            ))
          );

          nodePath.insertAfter(t.expressionStatement(decoratorsMetadata));
        }
      },
    },
  };
};
