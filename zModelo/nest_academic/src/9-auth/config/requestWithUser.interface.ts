import { Request } from 'express';
import { Funcionario } from '../../3-funcionario/entity/funcionario.entity';

interface RequestWithUser extends Request {
  // é obrigatorio usar a palavra 'user', pq o npm install passport só trabalha com esta palavra

  user: Funcionario;
}

export default RequestWithUser;
