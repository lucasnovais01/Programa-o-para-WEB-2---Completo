export class Mensagem<T> {
  status: number = 0;
  timestamp: string = '';
  mensagem: string = '';
  erro: string = '';
  dados: T | null;
  path: string = '';
}
