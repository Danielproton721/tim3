-- ============================================================
-- RECARGA TIM — Schema inicial
-- Execute uma vez no SQL Editor do Supabase
-- https://supabase.com/dashboard/project/<seu-project>/sql/new
-- ============================================================

-- Extensão pgcrypto (para gen_random_uuid)
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1) app_secrets: vault simples de chaves de API
-- Só o service_role consegue ler/escrever. A tabela é
-- bloqueada para todos os outros papéis (anon, authenticated).
-- ------------------------------------------------------------
create table if not exists public.app_secrets (
  key          text primary key,
  value        text not null,
  description  text,
  updated_at   timestamptz not null default now()
);

alter table public.app_secrets enable row level security;

-- Política explícita: ninguém (anon/authenticated) acessa.
drop policy if exists "app_secrets deny all" on public.app_secrets;
create policy "app_secrets deny all"
  on public.app_secrets
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- ------------------------------------------------------------
-- 2) pix_transactions: registros de transações PIX
-- ------------------------------------------------------------
create table if not exists public.pix_transactions (
  id              uuid primary key default gen_random_uuid(),
  pagou_id        text,                               -- id na Pagou.ai
  phone           text not null,                      -- celular (somente dígitos)
  phone_masked    text not null,                      -- (21) 99999-9999
  amount_cents    integer not null,                   -- em centavos
  bonus           text,                               -- "+20GB" etc
  description     text,
  status          text not null default 'waiting_payment',
  qr_code         text,                               -- copia-e-cola PIX
  qr_code_url     text,                               -- URL do QR
  expires_at      timestamptz not null,
  paid_at         timestamptz,
  postback_raw    jsonb,                              -- último postback recebido
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists pix_transactions_pagou_id_idx
  on public.pix_transactions (pagou_id);
create index if not exists pix_transactions_status_idx
  on public.pix_transactions (status);
create index if not exists pix_transactions_created_at_idx
  on public.pix_transactions (created_at desc);

alter table public.pix_transactions enable row level security;

drop policy if exists "pix_transactions deny all" on public.pix_transactions;
create policy "pix_transactions deny all"
  on public.pix_transactions
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- Trigger para manter updated_at sempre atualizado
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_pix_tx on public.pix_transactions;
create trigger set_updated_at_pix_tx
  before update on public.pix_transactions
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_updated_at_secrets on public.app_secrets;
create trigger set_updated_at_secrets
  before update on public.app_secrets
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- PRONTO. Agora execute 002_seed_secrets.sql para inserir
-- as chaves da Pagou (arquivo gerado separadamente, com as
-- credenciais reais, NUNCA commit para o git).
-- ------------------------------------------------------------
