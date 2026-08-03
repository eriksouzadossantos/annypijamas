# Anny Pijamas — site estático

Loja virtual completa em **HTML + CSS + JavaScript puro** (sem build, sem servidor, sem dependências).
Pedidos são finalizados pelo WhatsApp — não há pagamento online.

## Estrutura

```
index.html               Home (banner, destaques, categorias, depoimentos)
produtos.html            Catálogo com busca, filtros e ordenação
produto.html?slug=...    Página do produto (galeria, tamanhos P–G3, carrinho)
categorias.html          Lista de categorias
carrinho.html            Carrinho + formulário de entrega + envio ao WhatsApp
tabela-de-tamanhos.html  Tabela de medidas
duvidas.html             FAQ
politica-de-trocas.html  Política de trocas
sobre.html               Sobre a marca
styles.css               Design system (rosa claro, lilás, branco)
app.js                   Carrinho, filtros, renderização e integração WhatsApp
data.js                  Catálogo: produtos, categorias, medidas, FAQ, depoimentos
assets/                  Logo e imagens
```

## Como testar localmente

Abra `index.html` no navegador, ou rode um servidor simples:

```sh
python3 -m http.server 8000
```

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub.
2. Envie todos os arquivos desta pasta (botão **Add file → Upload files**, ou via git).
3. Vá em **Settings → Pages → Source: Deploy from a branch → main / (root)** e salve.
4. Em poucos minutos o site fica no ar em `https://SEU-USUARIO.github.io/SEU-REPO/`.

Para um domínio próprio: **Settings → Pages → Custom domain**.

## Como editar

- **Produtos, categorias, medidas e FAQ:** `data.js`
- **WhatsApp, Instagram e cidade:** topo do `app.js` (objeto `SITE`)
- **Cores e fontes:** variáveis `:root` no `styles.css`
- **Imagens:** substitua os arquivos em `assets/` mantendo os nomes

## Observação

Preços, descrições e depoimentos são exemplos — atualize em `data.js` com os dados reais.
