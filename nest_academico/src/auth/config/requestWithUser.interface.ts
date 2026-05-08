import { Usuario } from '@/usuario/entity/usuario.entity';

interface RequestWithUser extends Request {
  // é obrigatorio usar a palavra 'user', pq o npm install passport só trabalha com esta palavra
  user: Usuario;
}

export default RequestWithUser;
