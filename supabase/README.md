# Setup do Supabase — Recarga TIM

## Passos (uma única vez)

1. Entre no painel: https://supabase.com/dashboard/project/geqcmrydvgoglbyooavf/sql/new
2. Cole e rode `migrations/001_init.sql` → cria as tabelas `app_secrets` e `pix_transactions` com RLS bloqueando todos exceto `service_role`.
3. Cole e rode `migrations/002_seed_secrets.sql` → insere as chaves da Pagou no vault.
4. (Recomendado) Delete `002_seed_secrets.sql` do repo depois de rodar (ou não commit).

## Variáveis que precisam estar no Vercel / `.env.local`

- `NEXT_PUBLIC_SUPABASE_URL` → `https://geqcmrydvgoglbyooavf.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` → `sb_secret_...` (a chave secreta, server only)

Não coloque a `SUPABASE_SERVICE_ROLE_KEY` em código cliente — ela dá acesso total ao banco e bypassa RLS. Só no server (route handlers, Edge Functions, Server Actions).

## Como as chaves da Pagou são acessadas

O server chama `getSecret('PAGOU_SECRET_KEY')` via `lib/secrets.ts`, que usa o service role pra ler a tabela `app_secrets`. Em memória, a chave fica cacheada por 5 minutos. O browser nunca vê nenhuma dessas chaves.

## Webhook da Pagou

Ao criar a transação, enviamos `postbackUrl` com o token `PAGOU_WEBHOOK_SECRET` na query string:

```
https://seu-dominio/api/pix/webhook?t=<PAGOU_WEBHOOK_SECRET>
```

O endpoint `/api/pix/webhook` só aceita requests com o token correto, e em caso de sucesso atualiza `pix_transactions.status` = `paid`.
