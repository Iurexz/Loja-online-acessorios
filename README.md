# Adry Acessorios

Loja online em React, TypeScript, Vite e Tailwind. A vitrine publica continua funcionando com dados locais, mas a estrutura ja esta preparada para trocar catalogo, pedidos, newsletter e cupons por uma API.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Configuracao de API

Sem variavel de ambiente, o app usa dados locais e salva pedidos/newsletter em `localStorage`, util para prototipo e validacao.

Para ligar um backend real, crie `.env.local`:

```bash
VITE_API_BASE_URL=https://sua-api.com
```

Quando essa variavel existe, `src/services/storeRepository.ts` tenta usar a API e cai no modo local se a chamada falhar.

## Estrutura principal

- `src/App.tsx`: interface da loja, carrinho e checkout.
- `src/data/catalog.ts`: produtos, categorias e avaliacoes iniciais.
- `src/config/storefront.ts`: WhatsApp, contato, cupom principal e URL da API.
- `src/services/storeRepository.ts`: contrato de catalogo, pedidos, produtos, newsletter e cupons.
- `src/services/orderDraft.ts`: montagem do pedido e mensagem de WhatsApp.
- `src/services/promotions.ts`: validacao de cupons e calculo de desconto.
- `docs/backend-admin-plan.md`: plano do painel interno para o dono da loja.

## Contrato esperado da API

O frontend ja esta apontado para estes endpoints:

- `GET /storefront`
- `GET /products`
- `POST /orders`
- `POST /newsletter`
- `POST /coupons/validate`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`
- `GET /admin/coupons`
- `PUT /admin/coupons/:code`

Os endpoints `/admin/*` devem exigir login do dono/administrador.
