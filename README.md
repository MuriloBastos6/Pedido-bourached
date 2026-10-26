# Pedidos Bourached

Sistema de pedidos separado do site de produtos. Usa a mesma lista (`public/produtos.json`) e o mesmo visual, mas é um projeto independente.

## Layout
Inspirado na loja da Ibérica, com a identidade da Bourached (azul, amarelo e logos):
- Cabeçalho fixo com busca central, **Meus pedidos** e **Carrinho** (com total) + menu (Início, Categorias, Promoções, Meus pedidos, Contato).
- Página inicial (`src/pages/HomePage.jsx`): destaque, faixa "como funciona", atalhos de categoria, carrossel de promoções e vitrines de algumas categorias (lista `vitrines` no arquivo).
- Categorias, `/promocoes` e busca usam `ListagemLoja`: menu lateral de categorias, trilha, ordenação (relevância, nome, preço) e grade de produtos.
- Categorias da loja: `src/utils/categorias.js`.

## Como funciona
- No card, escolha a embalagem (25 KG, 5 KG...) e use **+ Adicionar** / seletor de quantidade. O chip mostra quantas unidades daquela embalagem já estão no carrinho.
- O carrinho (botão amarelo) pede nome, telefone e observações e mostra o total aproximado.
- **Finalizar pelo WhatsApp** salva o pedido neste aparelho e abre o WhatsApp com a mensagem formatada (produto, peso, quantidade, código e valor aproximado).
- No fim de cada categoria há setas para ir à categoria anterior/próxima (e voltar ao topo).
- `/meus-pedidos`: histórico e **repetir pedido** (com os preços atuais da lista).

## Lançador do atendente (`/atendente`)
Página interna para agilizar o lançamento no Flutt. O atendente cola o pedido do WhatsApp (mensagem da loja virtual **ou** texto escrito pelo cliente) e a tela mostra código, descrição, peso e quantidade de cada item, com os que precisam de conferência destacados. Botão **Copiar código ⇥ quantidade** copia a lista pronta para o lançamento; cada item pode ser marcado como "lançado". O progresso fica salvo no navegador.
Testes do leitor: `node scripts/teste-lancador.mjs`.

## Mobile
Cabeçalho compacto, menu de categorias vira faixa rolável, carrosséis arrastáveis, produtos em 2 colunas, barra do carrinho fixa embaixo e carrinho em tela cheia (`src/mobile.css`).

## Rodar
```
npm install
npm run dev
```

## Ajustes
- Número do WhatsApp: `src/config.js`
- Atualizar preços/produtos a partir do site original (sem alterá-lo):
  `npm run lista:sincronizar -- ../Lista-de-Produtos-Bourached`
- Armazenamento (hoje no aparelho do cliente): `src/storage/pedidosStorage.js`. Para login e histórico em qualquer aparelho, troque o miolo desse arquivo por um banco (ex.: Firebase).

## Publicar
Crie um repositório novo no GitHub e importe na Vercel (framework Vite). O `vercel.json` já cuida das rotas.
