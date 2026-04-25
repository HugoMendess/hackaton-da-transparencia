-- ============================================================
-- TransparaMA - Correções de auditoria LGPD e qualidade
-- ============================================================
-- Migration: 20260425150000_lgpd_bloqueios
-- Aplica:
--   1. Bloqueio de nomes de pessoas físicas no termos_buscados (LGPD)
--   2. Bloqueio de variantes sem acento (consolidação)
--   3. Bloqueio de artefatos da planilha original
--   4. Índice em ia_logs.pergunta_hash
-- ============================================================

-- ----------------------------------------------------------------
-- 1. Bloqueio de nomes de pessoas físicas
-- Critério: termos identificados como nomes próprios na planilha
-- cedida pela STC. Por princípio de proteção de dados (LGPD), nomes
-- não vão ao dashboard público até revisão da STC.
-- ----------------------------------------------------------------
UPDATE public.termos_buscados
SET
  bloqueado = TRUE,
  motivo_bloqueio = 'LGPD: nome de pessoa física, aguarda revisão da STC'
WHERE termo IN (
  'NILMA',
  'Orlando Barbosa Filho',
  'Alexsandro da Silva Sousa',
  'naiara araujo',
  'Maria de Fátima Santos Pereira',
  'JODSON SANTOS MACHADO',
  'juscelino de abreu passos',
  'Francisco Coelho dos Santos Junior',
  'Milena Moura Reinaldo',
  'Ronaldi Jouberth Diniz Madeira',
  'Carlos Brandão',
  'moisanielton',
  'Pvcantor',
  'Jorgeilson costa frazao',
  'Jarcio de souza',
  'Nikson daniel Souza da Silva',
  'José Wilson machado paixão',
  'Rivangelio Rodrigues Almeida',
  'João Willian Ferreira Bonfim',
  'Rebeca de Brito Fernandes',
  'Larissa Cristina de Castro Santana',
  'Daniel Maranhão Meneses',
  'Landia pereira da silva',
  'allisson gomes guimarães',
  'HILIAS LIMA BOSCOS'
);

-- ----------------------------------------------------------------
-- 2. Consolidação: variantes normalizadas sem acento
-- Mantém a versão com acento (mais legível) e bloqueia as sem.
-- ----------------------------------------------------------------
UPDATE public.termos_buscados
SET
  bloqueado = TRUE,
  motivo_bloqueio = 'Variante sem acento já representada por termo com acento'
WHERE termo IN (
  'salario',
  'diarias',
  'remuneracao',
  'salarios'
);

-- ----------------------------------------------------------------
-- 3. Artefatos da planilha original (truncamentos, encoding)
-- ----------------------------------------------------------------
UPDATE public.termos_buscados
SET
  bloqueado = TRUE,
  motivo_bloqueio = 'Artefato da planilha (truncamento ou encoding corrompido)'
WHERE termo IN (
  'Por-',
  'centro cultural Divino esp�rito santo da liberdade'
);

-- ----------------------------------------------------------------
-- 4. Índice em ia_logs.pergunta_hash para análise de uso
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS ia_logs_pergunta_hash_idx
  ON public.ia_logs (pergunta_hash);
