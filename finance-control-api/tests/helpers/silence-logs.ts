import logger from "../../src/utils/logger";

// O winston escreve direto no stdout; silencia para a saída dos testes ficar legível.
logger.silent = true;
