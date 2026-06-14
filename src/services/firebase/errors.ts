const firebaseErrorMessages: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha inválidos.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/email-already-in-use": "Já existe uma conta com este e-mail.",
  "auth/weak-password": "A senha precisa ser mais forte.",
  "auth/invalid-email": "Informe um e-mail válido.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
  "permission-denied": "Você não tem permissão para executar esta ação.",
  "storage/unauthorized": "Você não tem permissão para acessar este arquivo.",
  "storage/canceled": "Upload cancelado.",
  "storage/unknown": "Erro ao processar arquivo.",
};

type FirebaseLikeError = {
  code?: string;
  message?: string;
};

export function getFriendlyError(error: unknown) {
  const firebaseError = error as FirebaseLikeError;

  if (firebaseError.code && firebaseErrorMessages[firebaseError.code]) {
    return firebaseErrorMessages[firebaseError.code];
  }

  return firebaseError.message ?? "Ocorreu um erro inesperado. Tente novamente.";
}
