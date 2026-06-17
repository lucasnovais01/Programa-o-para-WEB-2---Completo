/*
import { TipoQuartoModule } from 'src/4-tipo-quarto/tipo-quarto.module';
import { QuartoModule } from 'src/5-quarto/quarto.module';
import { StatusReservaModule } from 'src/6-status-reserva/status-reserva.module';
import { ReservaModule } from 'src/7-reserva/reserva.module';
import { ServicoModule } from 'src/8-servico/servico.module';
import { HospedeServicoModule } from 'src/9-hospede-servico/hospede-servico.module';
*/

Antigamente, para eu poder usar o npm run start:dev, no pc de casa, eu precisava deste comando:

# Forma Correta (ES Modules + TS)
```ts
import * as oracledb from 'oracledb';

oracledb.initOracleClient({
  libDir: 'D:/.Lucas Novais/oracle/client',
});

// - Importa todos os exports do módulo oracledb como um namespace
// - TypeScript consegue inferir os tipos corretamente
// - Compatível com ES Modules
```


# Notas do Projeto (NestJS + Oracle)

## 1. Configuração do Oracle Client (Histórico)

### Tentativas Erradas
```ts
// ERRADO: CommonJS (require)
const oracledb = require('oracledb');

// ERRADO: Espera export default
import oracledb from 'oracledb';

