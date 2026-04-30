import { plainToInstance } from 'class-transformer';

// MUDANÇA: importamos Usuario no lugar de Auth
// Motivo: o converter recebe um Usuario vindo do banco e transforma
// em AuthResponse. O método toAuth() foi removido pois login não
// cria registro — só lê. Não precisamos converter Request → Entidade.

import { AuthResponse } from '../response/auth.response';
import { Usuario } from '@/usuario/entity/usuario.entity';

export class ConverterAuth {
  // MUDANÇA 2: toAuth() removido
  // Motivo: no fluxo de login não criamos nem salvamos nada no banco.
  // O converter de auth só precisa transformar o Usuario encontrado
  // em um AuthResponse para devolver ao front-end.

  // MUDANÇA 3: parâmetro é Usuario, não Auth
  static toAuthResponse(usuario: Usuario): AuthResponse {
    return plainToInstance(AuthResponse, usuario, {
      excludeExtraneousValues: true,
    });
  }
}
