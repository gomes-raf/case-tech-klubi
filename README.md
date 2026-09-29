<img src="public\logo-buscar.svg" height=100>

## Case Tech - Klubi

O busCar é um buscador de carros para compra, criado para o case técnico da Klubi. Nele o usuário informa o modelo, a cidade e quanto pretende investir, assim o site mostra os carros disponíveis diante dos filtros. Quando não existe um resultado exato, o site recomenda algumas opções parecidas.

### Instruções de como rodar o projeto

É preciso ter o Node.js 22.12 ou superior instalado.

```bash
git clone https://github.com/gomes-raf/case-tech-klubi.git
cd case-tech-klubi
npm install
npm run dev
```

Depois é só abrir http://localhost:5173 no navegador.

| Comando | O que faz |
| --- | --- |
| `npm test` | roda os testes da busca |
| `npm run build` | gera a versão de produção na pasta `dist` |
| `npm run lint` | verifica o padrão do código |

### Link Deploy

[Acessar o busCar](LINK_DO_DEPLOY)

### Decisões técnicas e User Experience

**Identidade visual**

A identidade do busCar foi criada com base na da Klubi, com o amarelo `#FEB73C` como cor de destaque, o grafite `#2D3031` nos textos e a fonte Poppins. O nome junta "busca" e "car" (carro em inglês). As cores e a fonte ficam centralizadas como tokens no `index.css`, o que mantém o visual igual em todos os componentes.

**Experiência de busca**

- A página tem um único objetivo, então a busca fica logo no topo com três campos: carro, localização e orçamento.
- Os campos de carro e cidade sugerem opções enquanto a pessoa digita, e cada cidade mostra quantos carros tem disponíveis.
- A busca ignora acentos, letras maiúsculas e a ordem das palavras. Por exemplo, "dolphin byd", "sao paulo" e "tcross" funcionam.
- O orçamento tem máscara de moeda, então basta digitar os números.
- Depois da busca, a página rola até os resultados, e cada card mostra se o preço está abaixo, dentro ou acima do orçamento (caso o filtro de preço tenha sido inserido pelo usuário).
- No desktop, um vídeo ao lado da busca dá movimento à página. No celular ele não é carregado, para economizar dados.

**Como a busca trata os casos do desafio**

1. Carro que existe: aparece nos resultados com um selo que mostra se está no orçamento ou quanto fica abaixo dele.
2. Carro que existe, mas acima do orçamento: em vez de uma tela vazia, o carro aparece com a diferença de preço, por exemplo "R$ 19.990 acima", junto com modelos parecidos que cabem no valor.
3. Carro que existe, mas em outra cidade: o carro aparece com o selo "Em outra cidade", junto com modelos parecidos disponíveis na cidade escolhida.

Os modelos parecidos priorizam a mesma categoria (hatch, sedã ou SUV) e depois o preço mais próximo. Assim a pessoa sempre sai da busca com uma opção real, mesmo quando o carro exato não está disponível.

**Decisões técnicas**

- React com TypeScript e Vite, pela agilidade no desenvolvimento e no build, com Tailwind CSS no estilo.
- A lógica de busca fica separada da interface, em funções puras no `src/lib/search.ts`, o que facilita testar e evoluir.
- As telas acessam os dados por uma camada de serviço (`src/services/cars-service.ts`) que já se comporta como uma API. Hoje ela lê o JSON local, e trocar por um backend de verdade não exige mudar nenhuma tela.
- Os três cenários do desafio têm testes automatizados com Vitest.
- As imagens dos carros foram trocadas por fotos mais representativas e convertidas para WebP.
- Acessibilidade: campos com rótulo, sugestões navegáveis pelo teclado, foco levado aos resultados depois da busca e respeito à preferência de reduzir movimento.

### Próximos passos

Na primeira versão, o header tinha atalhos para funcionalidades que ficaram para uma versão mais completa do produto:

- **Catálogo:** página com todos os carros, filtros avançados e ordenação.
- **Favoritos:** salvar carros para consultar depois.
- **Login e cadastro:** conta do usuário para guardar buscas e favoritos e receber alertas.

Além disso, os próximos passos naturais seriam:

- **Busca com IA:** entender pedidos em linguagem natural, como "dolphin até 100 mil em SP".
- **Backend próprio:** levar a busca para uma API, aproveitando a camada de serviço que já existe.

### 💼 Plano de Negócios

1. **Se você fosse lançar esse buscador no mercado, qual seria seu modelo de negócios?**

   Um marketplace gratuito para quem compra, com receita vinda de quem vende e de parceiros financeiros. Lojas e concessionárias pagam para anunciar seu carros, e o busCar ganha comissão por compra.

2. **Como você atrairia seus primeiros usuários? (Estratégia de aquisição, canais, etc)**

   - Começaria por quem vende, fechando parcerias com lojas de uma cidade para ter estoque real desde o início.
   - Para quem compra, investiria em SEO com páginas por modelo e cidade, como "BYD Dolphin em São Paulo", que é exatamente como as pessoas pesquisam. 
   - Além do SEO, focaria também em AEO para que Inteligências Artificiais tenham o busCar como resposta direta.
   - Um programa de indicação para quem comprou pelo busCar.
   - Marketing Digital, focando principalmente no Instagram e Linkedin.

3. **Qual seria sua estimativa de CAC (Custo de Aquisição de Cliente)?**

   Considerando um custo por clique de cerca de R$ 1,50 e que 5% dos visitantes entram em contato com um vendedor, o CAC de um comprador vindo de anúncios fica perto de R$ 30.

4. **Qual seria sua proposta de LTV (Lifetime Value) e como você maximizaria isso?**

   - Lojista: um plano de cerca de R$ 400 por mês, com permanência média de 18 meses, gera um LTV perto de R$ 7.200, quase cinco vezes o CAC.
   - Comprador: cada compra com crédito ou seguro rende algo entre R$ 1.000 e R$ 2.000 em comissões, e a pessoa volta a comprar a cada poucos anos.

   Para maximizar, a ideia é acompanhar o cliente depois da compra com seguro e revisões e, na hora de trocar de carro, ajudar a vender o usado e encontrar o próximo.

5. **Que tipo de monetização você considera viável para essa aplicação?**

   - Pagamento por contato qualificado enviado às lojas.
   - Planos mensais para lojistas, com anúncios em destaque e relatórios de desempenho.
   - Comissão sobre consórcio, financiamento e seguro.
   - Relatórios de mercado com dados agregados, como preço médio por modelo e região.

6. **Há alguma estratégia de retenção de usuários que você aplicaria?**

   - Alertas quando aparecer um carro que combina com a busca salva ou quando um preço cair.
   - Favoritos e comparação entre modelos, para a pessoa voltar durante a decisão.
   - Lembretes depois da compra, como revisão e renovação do seguro.
   - Para lojistas, um painel com os contatos recebidos e o desempenho dos anúncios, mostrando o retorno do investimento.
