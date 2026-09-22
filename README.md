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

A migração proposta está em `supabase/migrations/202609220001_site_rls.sql`. Ela deve ser revisada contra o estado real do projeto antes de ser aplicada. Não cria outro projeto e não altera dados de conteúdo.

## Validação

```sh
npm run check
npm run build
npm run test:e2e
```

## Implantação

Não há implantação pública configurada ou executada neste repositório.
