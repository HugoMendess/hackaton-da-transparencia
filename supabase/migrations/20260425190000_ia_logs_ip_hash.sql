-- ============================================================
-- TransparaMA - Correção da auditoria: rate limit por IP
-- ============================================================
-- Migration: 20260425190000_ia_logs_ip_hash
-- Aplica: coluna ip_hash em ia_logs para rate limit funcional
--         (a query antiga buscava ip em pergunta_hash, sempre count=0)
-- ============================================================

ALTER TABLE public.ia_logs
  ADD COLUMN IF NOT EXISTS ip_hash TEXT;

CREATE INDEX IF NOT EXISTS ia_logs_ip_hash_recent_idx
  ON public.ia_logs (ip_hash, created_at DESC);
