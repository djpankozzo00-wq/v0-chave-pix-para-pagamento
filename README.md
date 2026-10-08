# Painel Social

Interface em Next.js para reunir serviços de redes sociais, consulta de serviços e envio de pedidos.

## Desenvolvimento local

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env.local`.
3. Preencha `INSTABARATO_API_KEY` com sua chave privada do provedor de serviços.
4. Execute `npm run dev`.

Nunca coloque chaves privadas no código-fonte, em variáveis `NEXT_PUBLIC_*` ou em commits.

## Estado das integrações

- Página inicial, categorias, formulário de pedido, tela de login/cadastro e painel administrativo: interface inicial.
- Catálogo e envio de pedidos: dependem de uma chave válida do provedor configurada no servidor.
- Login/cadastro: ainda não conectados a um serviço de autenticação nem a um banco de dados.
- Área administrativa: demonstrativa; ainda não tem controle de acesso e não deve ser usada para administrar dados reais.
- Saldo e PIX: o saldo local do navegador não representa dinheiro recebido. Não considere um pagamento confirmado sem integração com um provedor PIX e validação do pagamento no servidor por webhook.
- Pedidos: antes de operar com clientes, implemente autenticação, validação e cobrança de saldo no servidor, limites de uso e proteção contra pedidos não autorizados.

## Verificação

Execute `npm run build` e `npm run lint` antes de publicar. As telas de demonstração não significam que autenticação, pagamentos ou painel administrativo estejam prontos para produção.
