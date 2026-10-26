# Pedidos Bourached

Sistema de pedidos separado do site de produtos. Os produtos, preços e fotos vêm do repositório **bourached-dados** (o mesmo das outras listas), então qualquer alteração feita no painel de lá aparece aqui sem novo deploy.

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
Como o leitor escolhe (texto escrito pelo cliente):
- O **nome** decide o produto; o peso escrito só escolhe a embalagem ("uva passa 5kg" sugere a caixa de 10 kg da uva passa, não a farinha de uva de 5 kg).
- Produto com forma que o cliente não pediu (pó, farinha, flocos, chips...) perde pontos. Plural e erro de uma letra são tolerados.
- Quilos viram quantidade quando fecham com a embalagem ("10 kg" de pacote de 5 kg = 2) e, quando não fecham, aparece um aviso para conferir.
- Ao trocar a sugestão de uma linha, o leitor **lembra** a escolha (neste aparelho) e usa nas próximas vezes que a mesma frase aparecer, ajustando a embalagem ao peso pedido. Dá para apagar em "Esquecer escolhas aprendidas".

Testes do leitor (usa a lista publicada do bourached-dados): `node scripts/teste-lancador.mjs`.

## Mobile
Cabeçalho compacto, menu de categorias vira faixa rolável, carrosséis arrastáveis, produtos em 2 colunas, barra do carrinho fixa embaixo e carrinho em tela cheia (`src/mobile.css`).

## Rodar
```
npm install
npm run dev
```

## Ajustes
- Número do WhatsApp: `src/config.js`
- Endereço dos produtos: `VITE_PRODUTOS_URL` no `.env` (hoje `https://bourached-dados.vercel.app/produtos.json`). As fotos (`/images/...`) são buscadas no mesmo servidor. Na Vercel, cadastre a mesma variável em **Settings → Environment Variables** se quiser trocar o endereço.
- Categoria nova no bourached-dados: adicione-a em `src/utils/categorias.js` (título, capa em `public/` e slug igual à chave do JSON).
- Armazenamento (hoje no aparelho do cliente): `src/storage/pedidosStorage.js`. Para login e histórico em qualquer aparelho, troque o miolo desse arquivo por um banco (ex.: Firebase).

## Publicar
Crie um repositório novo no GitHub e importe na Vercel (framework Vite). O `vercel.json` já cuida das rotas.
