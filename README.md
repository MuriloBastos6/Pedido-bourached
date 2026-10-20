# Pedidos Bourached

Sistema de pedidos separado do site de produtos. Usa a mesma lista (`public/produtos.json`) e o mesmo visual, mas é um projeto independente.

## Como funciona
- Em cada variação de peso há **+ Adicionar** e um seletor de quantidade.
- O carrinho (botão amarelo) pede nome, telefone e observações e mostra o total aproximado.
- **Finalizar pelo WhatsApp** salva o pedido neste aparelho e abre o WhatsApp com a mensagem formatada (produto, peso, quantidade, código e valor aproximado).
- `/meus-pedidos`: histórico e **repetir pedido** (com os preços atuais da lista).

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
