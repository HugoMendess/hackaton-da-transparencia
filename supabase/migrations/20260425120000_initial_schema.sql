-- ============================================================
-- TransparaMA - Schema inicial
-- ============================================================
-- Migration: 20260425120000_initial_schema
-- Aplica: extensões + tabelas core + cache + índices + RLS
-- Referência: ARQUITETURA.md seção 3.5
-- ============================================================

-- ----------------------------------------------------------------
-- Extensões
-- ----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS vector;       -- RAG semantic search
CREATE EXTENSION IF NOT EXISTS pg_trgm;      -- busca fuzzy
CREATE EXTENSION IF NOT EXISTS unaccent;     -- busca sem acento

-- ----------------------------------------------------------------
-- Tabela: eixos
-- 7 eixos temáticos de vida do cidadão
-- ----------------------------------------------------------------
CREATE TABLE public.eixos (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  nome         TEXT NOT NULL,
  descricao_cidada TEXT,
  icone        TEXT,
  ordem        INTEGER NOT NULL DEFAULT 0,
  destaque     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Tabela: glossario
-- Termos técnicos com explicação cidadã
-- ----------------------------------------------------------------
CREATE TABLE public.glossario (
  id                 SERIAL PRIMARY KEY,
  termo              TEXT NOT NULL,
  termo_normalizado  TEXT NOT NULL,
  explicacao_cidada  TEXT NOT NULL,
  exemplo            TEXT,
  embedding          VECTOR(1024),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT glossario_termo_unique UNIQUE (termo)
);

CREATE INDEX glossario_termo_normalizado_idx
  ON public.glossario USING gin (termo_normalizado gin_trgm_ops);

-- ----------------------------------------------------------------
-- Tabela: termos_buscados
-- Top termos pesquisados (alimentação inicial via planilha STC)
-- ----------------------------------------------------------------
CREATE TABLE public.termos_buscados (
  id                 SERIAL PRIMARY KEY,
  termo              TEXT NOT NULL,
  termo_normalizado  TEXT NOT NULL,
  total_buscas       INTEGER NOT NULL DEFAULT 0,
  ultima_busca       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  bloqueado          BOOLEAN NOT NULL DEFAULT FALSE,
  motivo_bloqueio    TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT termos_buscados_termo_unique UNIQUE (termo)
);

CREATE INDEX termos_buscados_norm_idx
  ON public.termos_buscados USING gin (termo_normalizado gin_trgm_ops);

CREATE INDEX termos_buscados_total_idx
  ON public.termos_buscados (total_buscas DESC) WHERE bloqueado = FALSE;

-- ----------------------------------------------------------------
-- Tabela: conteudos_cidadaos
-- Textos de descrição em linguagem simples por eixo
-- ----------------------------------------------------------------
CREATE TABLE public.conteudos_cidadaos (
  id                 SERIAL PRIMARY KEY,
  eixo_id            INTEGER REFERENCES public.eixos(id) ON DELETE CASCADE,
  topico             TEXT NOT NULL,
  texto              TEXT NOT NULL,
  embedding          VECTOR(1024),
  fonte_oficial_url  TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX conteudos_cidadaos_eixo_idx
  ON public.conteudos_cidadaos (eixo_id);

-- ----------------------------------------------------------------
-- Tabela: ia_cache
-- Cache semântico de respostas da AjudaInteligente
-- ----------------------------------------------------------------
CREATE TABLE public.ia_cache (
  id                  SERIAL PRIMARY KEY,
  pergunta_hash       TEXT NOT NULL UNIQUE,
  pergunta_embedding  VECTOR(1024),
  resposta            JSONB NOT NULL,
  tokens_used         INTEGER,
  expires_at          TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ia_cache_expires_idx
  ON public.ia_cache (expires_at);

-- ----------------------------------------------------------------
-- Tabela: ia_logs
-- Logs anônimos de uso da AjudaInteligente (TTL 7 dias, sem PII)
-- ----------------------------------------------------------------
CREATE TABLE public.ia_logs (
  id              SERIAL PRIMARY KEY,
  pergunta_hash   TEXT NOT NULL,
  trigger_type    TEXT,
  page_context    TEXT,
  helpful         BOOLEAN,
  tokens_used     INTEGER,
  response_time_ms INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ia_logs_created_idx
  ON public.ia_logs (created_at DESC);

-- ----------------------------------------------------------------
-- Tabela: api_cache
-- Cache das chamadas à API oficial do Portal MA
-- ----------------------------------------------------------------
CREATE TABLE public.api_cache (
  id           SERIAL PRIMARY KEY,
  endpoint     TEXT NOT NULL,
  params_hash  TEXT NOT NULL,
  response     JSONB NOT NULL,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT api_cache_unique UNIQUE (endpoint, params_hash)
);

CREATE INDEX api_cache_expires_idx
  ON public.api_cache (expires_at);

-- ----------------------------------------------------------------
-- Trigger de updated_at automático
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER eixos_updated_at
  BEFORE UPDATE ON public.eixos
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER glossario_updated_at
  BEFORE UPDATE ON public.glossario
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER conteudos_cidadaos_updated_at
  BEFORE UPDATE ON public.conteudos_cidadaos
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ----------------------------------------------------------------
-- Row Level Security (RLS)
-- Princípio: leitura pública para o cidadão, escrita só via service_role
-- ----------------------------------------------------------------

-- eixos: leitura pública
ALTER TABLE public.eixos ENABLE ROW LEVEL SECURITY;

CREATE POLICY eixos_select_public
  ON public.eixos FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- glossario: leitura pública
ALTER TABLE public.glossario ENABLE ROW LEVEL SECURITY;

CREATE POLICY glossario_select_public
  ON public.glossario FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- termos_buscados: leitura pública apenas dos não-bloqueados
ALTER TABLE public.termos_buscados ENABLE ROW LEVEL SECURITY;

CREATE POLICY termos_buscados_select_public
  ON public.termos_buscados FOR SELECT
  TO anon, authenticated
  USING (bloqueado = FALSE);

-- conteudos_cidadaos: leitura pública
ALTER TABLE public.conteudos_cidadaos ENABLE ROW LEVEL SECURITY;

CREATE POLICY conteudos_select_public
  ON public.conteudos_cidadaos FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- ia_cache: sem leitura pública (apenas service_role)
ALTER TABLE public.ia_cache ENABLE ROW LEVEL SECURITY;

-- ia_logs: sem leitura pública (apenas service_role)
ALTER TABLE public.ia_logs ENABLE ROW LEVEL SECURITY;

-- api_cache: sem leitura pública (apenas service_role)
ALTER TABLE public.api_cache ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- Função utilitária: normalizar termo (lowercase + sem acento)
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.normalizar_termo(t TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT LOWER(unaccent(COALESCE(t, '')));
$$;

COMMENT ON FUNCTION public.normalizar_termo IS
  'Normaliza um termo para busca: lowercase + remove acentos';
