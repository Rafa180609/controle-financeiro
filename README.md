# 💰 Controle Financeiro

Um aplicativo web moderno e responsivo para gerenciar seu patrimônio financeiro com facilidade.

## ✨ Funcionalidades

- **📊 Movimentações**: Registre receitas e despesas com data e descrição
- **📈 Distribuição**: Visualize a alocação do seu patrimônio em um gráfico donut
- **🎯 Metas**: Crie e acompanhe suas metas financeiras
- **🌙 Modo Escuro**: Alterne entre temas claro e escuro
- **💾 Offline-First**: Todos os dados são salvos localmente no navegador
- **📱 Responsivo**: Funciona perfeitamente em dispositivos móveis
- **♿ Acessível**: Interface amigável com suporte a leitores de tela

## 🚀 Como Usar

### Abrir Online
Acesse o site publicado no GitHub Pages:
```
https://rafa180609.github.io/controle-financeiro/
```

### Desenvolvedor Local
1. Clone o repositório:
```bash
git clone https://github.com/Rafa180609/controle-financeiro.git
cd controle-financeiro
```

2. Abra `index.html` no navegador:
```bash
# Opção 1: Abrir direto
open index.html

# Opção 2: Usar um servidor local (recomendado)
python3 -m http.server 8000
# Depois abra http://localhost:8000
```

## 📋 Abas Principais

### 1. Movimentações
- Adicione receitas ou despesas
- Visualize o histórico de transações
- Exclua itens conforme necessário

### 2. Distribuição
- Veja como seu patrimônio está distribuído
- Ajuste as porcentagens por categoria
- Categorias incluem: Reserva, Renda Fixa, FII, Ações, Criptomoedas e Objetivos Pessoais

### 3. Metas
- Crie novas metas financeiras
- Acompanhe o progresso com barras de progresso
- Adicione R$ 100 por vez ou edite manualmente

## 🎮 Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Alt + 1` | Ir para Movimentações |
| `Alt + 2` | Ir para Distribuição |
| `Alt + 3` | Ir para Metas |
| `Alt + T` | Alternar tema |
| `Enter` | Adicionar movimentação/meta |

## 🔧 Tecnologias

- **HTML5**: Semântica e estrutura
- **CSS3**: Mobile-first, Grid, Flexbox, variáveis CSS
- **JavaScript Vanilla**: Sem dependências externas
- **LocalStorage**: Persistência de dados
- **SVG**: Gráficos vetoriais

## 📊 Estrutura de Dados

### Transação
```javascript
{
  id: "abc123",
  type: "income" | "expense",
  description: "Salário",
  amount: 5000.00,
  date: "2026-06-15T10:30:00.000Z"
}
```

### Meta
```javascript
{
  id: "xyz789",
  name: "Viagem",
  target: 5000.00,
  current: 2500.00,
  createdAt: "2026-06-15T10:30:00.000Z"
}
```

### Categoria
```javascript
{
  id: "reserva",
  name: "Reserva de Emergência",
  pct: 20,
  color: "#10B981"
}
```

## 🌐 Suporte de Navegadores

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Chrome Mobile

## 🔒 Privacidade

✅ **Todos os dados são salvos apenas no seu dispositivo**
- Nenhum dado é enviado para servidores
- Nenhum rastreamento ou análise
- Você tem controle total dos seus dados

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
controle-financeiro/
├── index.html       # Estrutura HTML
├── style.css        # Estilos e responsividade
├── script.js        # Lógica da aplicação
├── manifest.json    # Configuração PWA
└── README.md        # Este arquivo
```

### Validações
- ✅ Descrições: 2-60 caracteres
- ✅ Valores: R$ 0,01 a R$ 999.999.999
- ✅ Porcentagens: soma deve atingir 100%
- ✅ Metas: valores positivos e acumulado ≤ alvo

## 🚀 GitHub Pages Setup

O repositório está configurado para publicação automática no GitHub Pages.

1. Vá em Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / folder: `/ (root)`
4. Acesse: `https://usuario.github.io/controle-financeiro/`

## 📝 Changelog

### v1.0.0
- ✅ Primeira versão
- ✅ Transações (receita/despesa)
- ✅ Distribuição com gráfico donut
- ✅ Metas com progresso
- ✅ Modo escuro/claro
- ✅ Responsivo e offline-first

## 📄 Licença

MIT License - Sinta-se livre para usar, modificar e distribuir

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Sinta-se à vontade para abrir issues ou PRs.

## 📞 Contato

- GitHub: [@Rafa180609](https://github.com/Rafa180609)
- Email: rafinhabrito1809@gmail.com

---

**Desenvolvido com ❤️ por Rafael**
