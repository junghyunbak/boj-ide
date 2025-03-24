module.exports = {
  create(context) {
    return {
      VariableDeclaration(node) {
        node.declarations.forEach((declaration) => {
          const parentFunction = context.getScope().block;

          if (!parentFunction || !parentFunction.id || !parentFunction.id.name.startsWith('useModify')) {
            return;
          }

          if (!declaration.init) {
            return;
          }

          const { type, callee } = declaration.init;

          if (type === 'CallExpression' && callee.name === 'useCallback') {
            return;
          }

          context.report({
            node: declaration,
            message: 'useModify<state> 훅 내부에서는 useCallback 외에 다른 훅을 사용할 수 없습니다.',
          });
        });
      },
    };
  },
};
