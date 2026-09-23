export const initialize = (initializers, root = document) => {
  initializers.forEach((initializer) => initializer(root));
};
