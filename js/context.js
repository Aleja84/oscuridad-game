let CTX = null;

function setLevelContext(ctx) {
  CTX = ctx;
}

function getLevelContext() {
  if (!CTX) {
    throw new Error('Level context no inicializado. Llama a setLevelContext(...) antes.');
  }
  return CTX;
}