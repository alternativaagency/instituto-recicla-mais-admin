# Instituto Recicla Mais

Site institucional e área administrativa privada do Instituto Recicla Mais.

## Arquitetura

- Next.js 16 App Router e TypeScript estrito
- Supabase Auth com OTP por e-mail
- Supabase Postgres com RLS para conteúdo público e administração autorizada
- CSS próprio e fontes institucionais já fornecidas
- Vitest, Playwright e axe para validação

Nenhuma credencial administrativa é enviada ao navegador. O site usa somente a chave pública do Supabase. A autorização administrativa depende da sessão autenticada e de um registro ativo em `authorized_users`, com RLS como limite final.

## Ambiente local

1. Copie `.env.example` para `.env.local`.
2. Preencha a URL e a publishable key do projeto Supabase existente.
3. Rode `npm install` e `npm run dev`.

## Banco de dados

1. Execute primeiro o diagnóstico somente leitura em `supabase/preflight.sql` e preserve o resultado.
2. Confirme tabelas, colunas, políticas, privilégios e possíveis identidades duplicadas.
3. Só então revise e aplique `supabase/migrations/202609220001_site_rls.sql`.

A migração substitui todas as políticas somente nas quatro tabelas da aplicação, fixa privilégios explícitos, restringe a execução das funções a `authenticated` e impede e-mails ou usuários autorizados duplicados. Ela não cria outro projeto nem altera dados de conteúdo.

Os usuários autorizados precisam existir previamente no Supabase Auth. O envio de OTP usa `shouldCreateUser: false`, portanto um endereço arbitrário não cria uma conta. Após o primeiro OTP válido, `claim_authorized_user` vincula o `auth.uid()` ao registro ativo de mesmo e-mail. Os papéis são: `admin` com CRUD completo, `editor` com criação e edição, e `viewer` somente leitura.

## Validação

```sh
npm run check
npm run build
npm run test:e2e
```

## Implantação

Não há implantação pública configurada ou executada neste repositório.
