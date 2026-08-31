export type TermoGlossario = {
  termo: string
  termo_normalizado: string
  explicacao_cidada: string
  exemplo: string | null
}

export const GLOSSARIO_TERMOS: TermoGlossario[] = [
  {
    termo: "Empenho",
    termo_normalizado: "empenho",
    explicacao_cidada: "Reserva de dinheiro que o governo faz para pagar um serviço ou compra futura.",
    exemplo: "O governo empenhou R$ 50 mil para comprar remédios para o hospital.",
  },
  {
    termo: "Liquidação",
    termo_normalizado: "liquidacao",
    explicacao_cidada: "Confirmação de que o serviço ou produto foi entregue e o pagamento pode ser feito.",
    exemplo: "Após receber os remédios, o governo confirmou a entrega.",
  },
  {
    termo: "Pagamento",
    termo_normalizado: "pagamento",
    explicacao_cidada: "O dinheiro que efetivamente saiu do cofre público para o fornecedor.",
    exemplo: "O dinheiro foi transferido para a farmácia.",
  },
  {
    termo: "Dotação orçamentária",
    termo_normalizado: "dotacao orcamentaria",
    explicacao_cidada: "O valor total que o governo planejou gastar em uma área durante o ano.",
    exemplo: "O governo planejou gastar R$ 2 bilhões com saúde em 2026.",
  },
  {
    termo: "Dotação atualizada",
    termo_normalizado: "dotacao atualizada",
    explicacao_cidada: "O valor que o governo pode gastar após ajustes ao longo do ano.",
    exemplo: "Após receber verbas extras, o orçamento da saúde foi para R$ 2,3 bilhões.",
  },
  {
    termo: "Crédito adicional",
    termo_normalizado: "credito adicional",
    explicacao_cidada: "Dinheiro extra adicionado ao orçamento após o início do ano.",
    exemplo: "O governo precisou de mais dinheiro para comprar vacinas e adicionou ao orçamento.",
  },
  {
    termo: "Natureza da despesa",
    termo_normalizado: "natureza da despesa",
    explicacao_cidada: "A classificação de para que serve o gasto (pessoal, material, serviços etc.).",
    exemplo: "Compra de remédios é diferente de pagamento de médicos.",
  },
  {
    termo: "Subelemento",
    termo_normalizado: "subelemento",
    explicacao_cidada: "O detalhe mais específico de como o dinheiro foi gasto.",
    exemplo: "Dentro de Materiais, o subelemento mostra exatamente Seringas descartáveis.",
  },
  {
    termo: "Modalidade de aplicação",
    termo_normalizado: "modalidade de aplicacao",
    explicacao_cidada: "A forma como o dinheiro chegou ao destino (diretamente ou por transferência).",
    exemplo: "O estado repassou dinheiro diretamente para o município.",
  },
  {
    termo: "LOA",
    termo_normalizado: "loa",
    explicacao_cidada: "Lei Orçamentária Anual, a lei que define quanto o governo pode gastar e em quê durante o ano.",
    exemplo: "É o orçamento doméstico do governo para o ano.",
  },
  {
    termo: "Função",
    termo_normalizado: "funcao",
    explicacao_cidada: "A área principal de atuação do governo (saúde, educação, segurança etc.).",
    exemplo: "A Função Saúde reúne tudo que o governo gasta com saúde.",
  },
  {
    termo: "Subfunção",
    termo_normalizado: "subfuncao",
    explicacao_cidada: "Um detalhe dentro de uma função maior.",
    exemplo: "Dentro de Saúde, a subfunção pode ser Atenção Básica (postos de saúde).",
  },
  {
    termo: "Programa",
    termo_normalizado: "programa",
    explicacao_cidada: "Um conjunto de projetos com um objetivo em comum.",
    exemplo: "Maranhão Livre da Fome é um programa social.",
  },
  {
    termo: "Ação",
    termo_normalizado: "acao",
    explicacao_cidada: "Uma tarefa específica dentro de um programa.",
    exemplo: "Distribuição de cestas básicas é uma ação do programa de combate à fome.",
  },
  {
    termo: "Projeto",
    termo_normalizado: "projeto",
    explicacao_cidada: "Ação com prazo definido para criar algo novo.",
    exemplo: "Construção de uma escola nova.",
  },
  {
    termo: "Atividade",
    termo_normalizado: "atividade",
    explicacao_cidada: "Ação contínua, sem prazo de término.",
    exemplo: "Manutenção e funcionamento das escolas já existentes.",
  },
  {
    termo: "Unidade gestora",
    termo_normalizado: "unidade gestora",
    explicacao_cidada: "O órgão ou secretaria responsável pelo gasto.",
    exemplo: "Secretaria de Saúde, Secretaria de Educação.",
  },
  {
    termo: "Licitação",
    termo_normalizado: "licitacao",
    explicacao_cidada: "O processo obrigatório que o governo usa para escolher fornecedores pelo menor preço.",
    exemplo: "Como um concurso para escolher a empresa que vai construir uma escola.",
  },
  {
    termo: "Pregão",
    termo_normalizado: "pregao",
    explicacao_cidada: "Um tipo de licitação para compras de produtos e serviços comuns, feita de forma mais rápida.",
    exemplo: "Compra de computadores para as secretarias.",
  },
  {
    termo: "Tomada de preços",
    termo_normalizado: "tomada de precos",
    explicacao_cidada: "Um tipo de licitação para contratos médios, onde empresas já cadastradas participam.",
    exemplo: "Reforma de um prédio público.",
  },
  {
    termo: "Concorrência",
    termo_normalizado: "concorrencia",
    explicacao_cidada: "O tipo de licitação mais formal, usado para contratos grandes.",
    exemplo: "Construção de uma rodovia.",
  },
  {
    termo: "Dispensa de licitação",
    termo_normalizado: "dispensa de licitacao",
    explicacao_cidada: "Compra feita sem o processo de licitação em situações específicas permitidas por lei.",
    exemplo: "Compra de urgência para emergência de saúde pública.",
  },
  {
    termo: "Inexigibilidade",
    termo_normalizado: "inexigibilidade",
    explicacao_cidada: "Quando só existe um fornecedor possível, então não é necessário licitar.",
    exemplo: "Contratação de um artista famoso para evento oficial.",
  },
  {
    termo: "Empreitada",
    termo_normalizado: "empreitada",
    explicacao_cidada: "Um contrato para execução de obras com preço global definido.",
    exemplo: "Construção de um hospital por R$ 10 milhões no total.",
  },
  {
    termo: "Receita corrente",
    termo_normalizado: "receita corrente",
    explicacao_cidada: "Dinheiro que o governo recebe regularmente (impostos, taxas etc.).",
    exemplo: "ICMS que as empresas pagam todo mês.",
  },
  {
    termo: "Receita de capital",
    termo_normalizado: "receita de capital",
    explicacao_cidada: "Dinheiro que o governo recebe de forma eventual (venda de bens, empréstimos).",
    exemplo: "Venda de um terreno público.",
  },
  {
    termo: "FPE",
    termo_normalizado: "fpe",
    explicacao_cidada: "Fundo de Participação dos Estados, transferência que o governo federal faz para os estados.",
    exemplo: "Parte dos impostos federais que o Maranhão recebe automaticamente.",
  },
  {
    termo: "ICMS",
    termo_normalizado: "icms",
    explicacao_cidada: "Imposto sobre produtos e serviços, principal fonte de receita dos estados.",
    exemplo: "Parte do preço que você paga no supermercado vai para o estado.",
  },
  {
    termo: "IPVA",
    termo_normalizado: "ipva",
    explicacao_cidada: "Imposto sobre veículos, metade vai para o estado, metade para o município do proprietário.",
    exemplo: "O imposto do seu carro.",
  },
  {
    termo: "Subsídio",
    termo_normalizado: "subsidio",
    explicacao_cidada: "Forma de remuneração de cargos políticos e altos cargos públicos.",
    exemplo: "O subsídio do governador é fixado por lei.",
  },
]
