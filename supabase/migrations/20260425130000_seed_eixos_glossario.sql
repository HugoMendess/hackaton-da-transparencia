-- ============================================================
-- Portal da Transparência MA - Seed: eixos e glossário
-- ============================================================
-- Migration: 20260425130000_seed_eixos_glossario
-- Aplica: 7 eixos temáticos + 30 termos do glossário
-- ============================================================

-- ----------------------------------------------------------------
-- Eixos temáticos
-- Gestão Pública em destaque (uso real do portal: 72% das visualizações
-- estão em Remuneração + Ficha Financeira, conforme DADOS_REAIS.md)
-- ----------------------------------------------------------------
INSERT INTO public.eixos (slug, nome, descricao_cidada, icone, ordem, destaque) VALUES
  ('gestao-publica',     'Gestão Pública',          'Servidores, salários, fornecedores, contratos, licitações e diárias', 'Users',         1, TRUE),
  ('saude',              'Saúde e Bem-Estar',       'Hospitais, medicamentos, programas de saúde e escalas',                'Heart',         2, FALSE),
  ('educacao',           'Educação e Futuro',       'Vagas, gastos por escola, merenda, transporte e bolsas',               'GraduationCap', 3, FALSE),
  ('seguranca',          'Segurança Pública',       'Polícia, bombeiros, defesa civil e viaturas',                          'Shield',        4, FALSE),
  ('habitacao',          'Habitação e Cidade',      'Programas habitacionais e regularização',                              'Home',          5, FALSE),
  ('programas-sociais',  'Programas Sociais',       'Maranhão Livre da Fome, auxílios e benefícios',                        'HandHeart',     6, FALSE),
  ('obras',              'Obras e Infraestrutura',  'Mapa de obras, status, fotos, valores e prazos',                       'Hammer',        7, FALSE);

-- ----------------------------------------------------------------
-- Glossário (30 termos curados, ver GLOSSARIO.md)
-- ----------------------------------------------------------------
INSERT INTO public.glossario (termo, termo_normalizado, explicacao_cidada, exemplo) VALUES
  ('Empenho',                'empenho',                'Reserva de dinheiro que o governo faz para pagar um serviço ou compra futura.',                'O governo empenhou R$ 50 mil para comprar remédios para o hospital.'),
  ('Liquidação',             'liquidacao',             'Confirmação de que o serviço ou produto foi entregue e o pagamento pode ser feito.',           'Após receber os remédios, o governo confirmou a entrega.'),
  ('Pagamento',              'pagamento',              'O dinheiro que efetivamente saiu do cofre público para o fornecedor.',                         'O dinheiro foi transferido para a farmácia.'),
  ('Dotação orçamentária',   'dotacao orcamentaria',   'O valor total que o governo planejou gastar em uma área durante o ano.',                       'O governo planejou gastar R$ 2 bilhões com saúde em 2026.'),
  ('Dotação atualizada',     'dotacao atualizada',     'O valor que o governo pode gastar após ajustes ao longo do ano.',                              'Após receber verbas extras, o orçamento da saúde foi para R$ 2,3 bilhões.'),
  ('Crédito adicional',      'credito adicional',      'Dinheiro extra adicionado ao orçamento após o início do ano.',                                 'O governo precisou de mais dinheiro para comprar vacinas e adicionou ao orçamento.'),
  ('Natureza da despesa',    'natureza da despesa',    'A classificação de para que serve o gasto (pessoal, material, serviços etc.).',                'Compra de remédios é diferente de pagamento de médicos.'),
  ('Subelemento',            'subelemento',            'O detalhe mais específico de como o dinheiro foi gasto.',                                      'Dentro de Materiais, o subelemento mostra exatamente Seringas descartáveis.'),
  ('Modalidade de aplicação','modalidade de aplicacao','A forma como o dinheiro chegou ao destino (diretamente ou por transferência).',                'O estado repassou dinheiro diretamente para o município.'),
  ('LOA',                    'loa',                    'Lei Orçamentária Anual, a lei que define quanto o governo pode gastar e em quê durante o ano.', 'É o orçamento doméstico do governo para o ano.'),
  ('Função',                 'funcao',                 'A área principal de atuação do governo (saúde, educação, segurança etc.).',                    'A Função Saúde reúne tudo que o governo gasta com saúde.'),
  ('Subfunção',              'subfuncao',              'Um detalhe dentro de uma função maior.',                                                       'Dentro de Saúde, a subfunção pode ser Atenção Básica (postos de saúde).'),
  ('Programa',               'programa',               'Um conjunto de projetos com um objetivo em comum.',                                            'Maranhão Livre da Fome é um programa social.'),
  ('Ação',                   'acao',                   'Uma tarefa específica dentro de um programa.',                                                 'Distribuição de cestas básicas é uma ação do programa de combate à fome.'),
  ('Projeto',                'projeto',                'Ação com prazo definido para criar algo novo.',                                                'Construção de uma escola nova.'),
  ('Atividade',              'atividade',              'Ação contínua, sem prazo de término.',                                                         'Manutenção e funcionamento das escolas já existentes.'),
  ('Unidade gestora',        'unidade gestora',        'O órgão ou secretaria responsável pelo gasto.',                                                'Secretaria de Saúde, Secretaria de Educação.'),
  ('Licitação',              'licitacao',              'O processo obrigatório que o governo usa para escolher fornecedores pelo menor preço.',         'Como um concurso para escolher a empresa que vai construir uma escola.'),
  ('Pregão',                 'pregao',                 'Um tipo de licitação para compras de produtos e serviços comuns, feita de forma mais rápida.',  'Compra de computadores para as secretarias.'),
  ('Tomada de preços',       'tomada de precos',       'Um tipo de licitação para contratos médios, onde empresas já cadastradas participam.',          'Reforma de um prédio público.'),
  ('Concorrência',           'concorrencia',           'O tipo de licitação mais formal, usado para contratos grandes.',                               'Construção de uma rodovia.'),
  ('Dispensa de licitação',  'dispensa de licitacao',  'Compra feita sem o processo de licitação em situações específicas permitidas por lei.',        'Compra de urgência para emergência de saúde pública.'),
  ('Inexigibilidade',        'inexigibilidade',        'Quando só existe um fornecedor possível, então não é necessário licitar.',                     'Contratação de um artista famoso para evento oficial.'),
  ('Empreitada',             'empreitada',             'Um contrato para execução de obras com preço global definido.',                                'Construção de um hospital por R$ 10 milhões no total.'),
  ('Receita corrente',       'receita corrente',       'Dinheiro que o governo recebe regularmente (impostos, taxas etc.).',                           'ICMS que as empresas pagam todo mês.'),
  ('Receita de capital',     'receita de capital',     'Dinheiro que o governo recebe de forma eventual (venda de bens, empréstimos).',                'Venda de um terreno público.'),
  ('FPE',                    'fpe',                    'Fundo de Participação dos Estados, transferência que o governo federal faz para os estados.',  'Parte dos impostos federais que o Maranhão recebe automaticamente.'),
  ('ICMS',                   'icms',                   'Imposto sobre produtos e serviços, principal fonte de receita dos estados.',                   'Parte do preço que você paga no supermercado vai para o estado.'),
  ('IPVA',                   'ipva',                   'Imposto sobre veículos, metade vai para o estado, metade para o município do proprietário.',   'O imposto do seu carro.'),
  ('Subsídio',               'subsidio',               'Forma de remuneração de cargos políticos e altos cargos públicos.',                            'O subsídio do governador é fixado por lei.');
