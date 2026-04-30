export interface Usuario {
  emailUsuario?: string;
  senhaUsuario?: string;
}

export interface ErrosUsuario {
  emailUsuario?: boolean;
  senhaUsuario?: boolean;

  emailUsuarioMensagem?: string[];
  senhaUsuarioMensagem?: string[];
}
