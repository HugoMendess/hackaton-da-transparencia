-- ============================================================
-- Portal da Transparência MA - Seed: 2 eixos adicionais (grid 3x3 perfeito)
-- ============================================================
-- Migration: 20260425170000_seed_eixos_extras
-- Aplica: Cultura/Esporte/Lazer + Meio Ambiente
-- ============================================================

INSERT INTO public.eixos (slug, nome, descricao_cidada, icone, ordem, destaque)
VALUES
  ('cultura-esporte', 'Cultura, Esporte e Lazer', 'Equipamentos culturais, eventos, esporte, juventude', 'Drama', 8, FALSE),
  ('meio-ambiente',   'Meio Ambiente',            'SEMA, recursos hídricos, fiscalização, áreas protegidas', 'Leaf',  9, FALSE)
ON CONFLICT (slug) DO NOTHING;
