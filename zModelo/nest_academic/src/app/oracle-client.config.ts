/*
import * as oracledb from 'oracledb';

oracledb.initOracleClient({
  libDir: 'C:\\Oracle client\\instantclient_23_9',
});
*/

/*
escola:

ORACLE_LIB_DIR=D:/.Lucas Novais/oracle/client

casa:

ORACLE_LIB_DIR=C:\\Oracle client\\instantclient_23_9
*/

/*
// Não funcionou, o eu criei este arquivo, pra não ter que ficar trocando toda hora o libDir


import * as oracledb from 'oracledb';

// Lê do process.env (carregado pelo Node antes do Nest)
const libDir = process.env.ORACLE_CLIENT_LIB_DIR;

if (libDir) {
  oracledb.initOracleClient({ libDir });
} else {
  throw new Error('ORACLE_CLIENT_LIB_DIR não está definido no .env');
}
*/
