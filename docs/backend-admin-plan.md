# Plano de backend e administracao

Objetivo: manter a vitrine publica igual, mas permitir que o dono da loja gerencie produtos, pedidos, cupons e descontos por uma area interna protegida.

## Caminho recomendado

Criar um painel `/admin` separado da vitrine, com login obrigatorio. O frontend publico consome `GET /storefront`; o painel interno consome endpoints `/admin/*`. Assim o visual da loja nao precisa mudar quando o backend entrar.

## Fluxos do dono da loja

1. Produtos: cadastrar nome, categoria, preco, preco antigo, parcelamento, desconto Pix, selo, fotos, estoque e status publicado/rascunho.
2. Pedidos: visualizar compras feitas pelo checkout, abrir detalhe com cliente/endereco/itens, alterar status e acionar WhatsApp.
3. Cupons: criar codigo, tipo de desconto, valor, validade, minimo de compra, limite de uso e status ativo/inativo.
4. Descontos: marcar produto com preco antigo/preco atual ou aplicar campanha por categoria.
5. Relatorios: acompanhar pedidos novos, faturamento estimado, produtos mais pedidos e leads da newsletter.

## Modelos de dados

Produto:

```ts
{
  id: string
  name: string
  category: string
  price: string
  oldPrice?: string
  pix: string
  installment: string
  badge: 'Best Seller' | 'Novidade' | 'Reposicao'
  tone: string
}
```

Pedido:

```ts
{
  id: string
  customer: { fullName: string; phone: string; email: string }
  deliveryAddress: { cep: string; street: string; number: string; neighborhood: string; city: string; state: string }
  items: Array<{ productId: string; name: string; quantity: number; unitPrice: number; lineTotal: number }>
  totals: { subtotal: number; discount: number; shipping: number | null; total: number; currency: 'BRL' }
  paymentMethod: 'Pix' | 'Cartao' | 'Boleto'
  status: 'new' | 'confirmed' | 'paid' | 'fulfilled' | 'canceled'
}
```

Cupom:

```ts
{
  code: string
  type: 'percentage' | 'fixed'
  amount: number
  description: string
  isActive: boolean
  minimumSubtotal?: number
  expiresAt?: string
}
```

## Endpoints

- `GET /storefront`: retorna categorias, produtos publicados e avaliacoes.
- `GET /products`: retorna produtos publicados para a vitrine.
- `POST /orders`: cria pedido vindo do checkout.
- `POST /newsletter`: salva lead e origem.
- `POST /coupons/validate`: valida cupom e retorna desconto calculado.
- `POST /admin/products`: cria produto.
- `PATCH /admin/products/:id`: edita produto.
- `DELETE /admin/products/:id`: remove ou arquiva produto.
- `GET /admin/orders`: lista pedidos com filtros por status/data.
- `PATCH /admin/orders/:id/status`: atualiza status do pedido.
- `GET /admin/coupons`: lista cupons.
- `PUT /admin/coupons/:code`: cria ou atualiza cupom.

## Regras importantes

- Nunca deixar `/admin/*` sem autenticacao.
- Imagens de produto devem ir para storage/CDN, e a API deve salvar apenas URLs.
- Preco deve ser salvo como numero no backend; o frontend ainda mostra string para preservar o visual atual.
- Pedido deve ser salvo antes do redirecionamento para WhatsApp, para nao depender somente da conversa.
- Cupom precisa registrar uso por pedido para evitar reutilizacao indevida.
