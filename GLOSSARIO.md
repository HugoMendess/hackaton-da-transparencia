# 📖 GLOSSÁRIO - Termos Técnicos para Linguagem Simples

> Este glossário alimenta o componente de tooltip na interface do TransparaMA.
> Formato JSON disponível em `frontend/src/data/glossario.json`

---

## Termos de Despesa

| Termo técnico | Explicação cidadã | Exemplo |
|---|---|---|
| **Empenho** | Reserva de dinheiro que o governo faz para pagar um serviço ou compra futura | O governo empenhou R$ 50 mil para comprar remédios para o hospital |
| **Liquidação** | Confirmação de que o serviço ou produto foi entregue e o pagamento pode ser feito | Após receber os remédios, o governo confirmou a entrega |
| **Pagamento** | O dinheiro que efetivamente saiu do cofre público para o fornecedor | O dinheiro foi transferido para a farmácia |
| **Dotação orçamentária** | O valor total que o governo planejou gastar em uma área durante o ano | O governo planejou gastar R$ 2 bilhões com saúde em 2025 |
| **Dotação atualizada** | O valor que o governo pode gastar após ajustes ao longo do ano | Após receber verbas extras, o orçamento da saúde foi para R$ 2,3 bilhões |
| **Crédito adicional** | Dinheiro extra adicionado ao orçamento após o início do ano | O governo precisou de mais dinheiro para comprar vacinas e adicionou ao orçamento |
| **Natureza da despesa** | A classificação de para que serve o gasto (pessoal, material, serviços etc.) | "Compra de remédios" é diferente de "pagamento de médicos" |
| **Subelemento** | O detalhe mais específico de como o dinheiro foi gasto | Dentro de "Materiais", o subelemento mostra exatamente "Seringas descartáveis" |
| **Modalidade de aplicação** | A forma como o dinheiro chegou ao destino (diretamente ou por transferência) | O estado repassou dinheiro diretamente para o município |

---

## Termos de Orçamento

| Termo técnico | Explicação cidadã | Exemplo |
|---|---|---|
| **LOA** | Lei Orçamentária Anual, a lei que define quanto o governo pode gastar e em quê durante o ano | É o "orçamento doméstico" do governo para o ano |
| **Função** | A área principal de atuação do governo (saúde, educação, segurança etc.) | A "Função Saúde" reúne tudo que o governo gasta com saúde |
| **Subfunção** | Um detalhe dentro de uma função maior | Dentro de "Saúde", a subfunção pode ser "Atenção Básica" (postos de saúde) |
| **Programa** | Um conjunto de projetos com um objetivo em comum | "Maranhão Livre da Fome" é um programa social |
| **Ação** | Uma tarefa específica dentro de um programa | "Distribuição de cestas básicas" é uma ação do programa de combate à fome |
| **Projeto** | Ação com prazo definido para criar algo novo | Construção de uma escola nova |
| **Atividade** | Ação contínua, sem prazo de término | Manutenção e funcionamento das escolas já existentes |
| **Unidade gestora** | O órgão ou secretaria responsável pelo gasto | Secretaria de Saúde, Secretaria de Educação etc. |

---

## Termos de Licitação e Contratos

| Termo técnico | Explicação cidadã | Exemplo |
|---|---|---|
| **Licitação** | O processo obrigatório que o governo usa para escolher quem vai fornecer um serviço ou produto, buscando o menor preço | Como um "concurso" para escolher a empresa que vai construir uma escola |
| **Pregão** | Um tipo de licitação para compras de produtos e serviços comuns, feita de forma mais rápida | Compra de computadores para as secretarias |
| **Tomada de preços** | Um tipo de licitação para contratos médios, onde empresas já cadastradas participam | Reforma de um prédio público |
| **Concorrência** | O tipo de licitação mais formal, usado para contratos grandes | Construção de uma rodovia |
| **Dispensa de licitação** | Compra feita sem o processo de licitação em situações específicas permitidas por lei | Compra de urgência para emergência de saúde pública |
| **Inexigibilidade** | Quando só existe um fornecedor possível, então não é necessário licitar | Contratação de um artista famoso para evento oficial |
| **Empreitada** | Um contrato para execução de obras com preço global definido | Construção de um hospital por R$ 10 milhões no total |

---

## Termos de Receita

| Termo técnico | Explicação cidadã | Exemplo |
|---|---|---|
| **Receita corrente** | Dinheiro que o governo recebe regularmente (impostos, taxas etc.) | ICMS que as empresas pagam todo mês |
| **Receita de capital** | Dinheiro que o governo recebe de forma eventual (venda de bens, empréstimos) | Venda de um terreno público |
| **FPE** | Fundo de Participação dos Estados, transferência que o governo federal faz para os estados | Parte dos impostos federais que o Maranhão recebe automaticamente |
| **ICMS** | Imposto sobre produtos e serviços, principal fonte de receita dos estados | Parte do preço que você paga no supermercado vai para o estado |
| **IPVA** | Imposto sobre veículos, metade vai para o estado, metade para o município do proprietário | O imposto do seu carro |

---

## Arquivo JSON (glossario.json)

```json
{
  "empenho": {
    "termo": "Empenho",
    "explicacao": "Reserva de dinheiro para pagar um serviço ou compra futura.",
    "exemplo": "O governo empenhou R$ 50 mil para comprar remédios."
  },
  "liquidacao": {
    "termo": "Liquidação",
    "explicacao": "Confirmação de que o serviço ou produto foi entregue e o pagamento pode ser feito.",
    "exemplo": "Após receber os remédios, o governo confirmou a entrega."
  },
  "dotacao": {
    "termo": "Dotação orçamentária",
    "explicacao": "O valor total planejado para gastar em uma área durante o ano.",
    "exemplo": "O governo planejou R$ 2 bilhões para saúde em 2025."
  },
  "natureza_despesa": {
    "termo": "Natureza da despesa",
    "explicacao": "A classificação de para que serve o gasto.",
    "exemplo": "Compra de remédios é diferente de pagamento de médicos."
  },
  "subelemento": {
    "termo": "Subelemento",
    "explicacao": "O detalhe mais específico de como o dinheiro foi gasto.",
    "exemplo": "Dentro de 'Materiais', mostra exatamente 'Seringas descartáveis'."
  },
  "loa": {
    "termo": "LOA",
    "explicacao": "Lei Orçamentária Anual, a lei que define quanto o governo pode gastar e em quê.",
    "exemplo": "É o orçamento anual do governo."
  },
  "unidade_gestora": {
    "termo": "Unidade gestora",
    "explicacao": "O órgão ou secretaria responsável pelo gasto.",
    "exemplo": "Secretaria de Saúde, Secretaria de Educação."
  },
  "licitacao": {
    "termo": "Licitação",
    "explicacao": "O processo obrigatório para o governo escolher fornecedores pelo menor preço.",
    "exemplo": "Um concurso para escolher a empresa que vai construir uma escola."
  },
  "dispensa": {
    "termo": "Dispensa de licitação",
    "explicacao": "Compra sem licitação, permitida por lei em situações específicas.",
    "exemplo": "Compra urgente durante emergência de saúde."
  },
  "credito_adicional": {
    "termo": "Crédito adicional",
    "explicacao": "Dinheiro extra adicionado ao orçamento ao longo do ano.",
    "exemplo": "Verba extra para comprar vacinas durante epidemia."
  }
}
```
