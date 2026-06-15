# Controle Financeiro - Guia de Desenvolvimento

## 📚 Documentação Técnica

### Arquitetura

```
┌─────────────────────────────────┐
│         HTML (index.html)        │
│   - Estrutura semântica        │
│   - Atributos ARIA             │
│   - Meta tags PWA              │
└────────────────┬────────────────┘
                 │
         ┌───────┴────────┐
         ▼                ▼
    ┌─────────┐      ┌─────────────┐
    │ CSS     │      │ JavaScript  │
    │(style.  │      │ (script.js) │
    │css)     │      │             │
    └─────────┘      └────────┬────┘
         │                    │
         │            ┌───────┴────────┐
         │            ▼                ▼
         │        ┌────────┐      ┌──────────┐
         │        │ State  │      │LocalStore│
         │        │Manager │      │  age    │
         │        └────────┘      └──────────┘
         │
         └─────────────┬──────────────────┐
                       ▼                  ▼
                   ┌────────┐        ┌────────┐
                   │ Render │        │ Events │
                   │        │        │Handler │
                   └────────┘        └────────┘
```

### State Management

O estado é centralizado em um único objeto `state`:

```javascript
state = {
  transactions: [...],    // Array de movimentações
  goals: [...],          // Array de metas
  categories: [...],     // Array de categorias
  theme: 'light',        // 'light' ou 'dark'
  txType: 'income'       // 'income' ou 'expense'
}
```

### Ciclo de Vida

1. **Init**: Carrega dados do localStorage
2. **Setup**: Vincula event listeners
3. **Render**: Atualiza DOM com base no state
4. **Update**: Modificação do state
5. **Save**: Persiste no localStorage
6. **Render**: Atualiza a interface

### Funções Principais

#### Estado
- `createInitialState()` - Cria estado inicial
- `detectSystemTheme()` - Detecta tema do SO
- `saveState()` - Persiste em localStorage
- `loadState()` - Carrega do localStorage

#### UI
- `renderHero()` - Atualiza totais
- `renderTransactions()` - Lista transações
- `renderDistribuicao()` - Gráfico e distribuição
- `renderGoals()` - Lista metas
- `renderAll()` - Atualiza tudo

#### Validação
- `validateAmount()` - Valida valor monetário
- `validateDescription()` - Valida descrição
- `validatePercentage()` - Valida percentual

#### Utilitários
- `uid()` - Gera ID único
- `BRL()` - Formata para moeda
- `escapeHtml()` - Previne XSS
- `toast()` - Notificação

### Segurança

#### XSS Prevention
```javascript
// ❌ Não faça
element.innerHTML = userInput;

// ✅ Faça
element.textContent = escapeHtml(userInput);
```

#### Validação de Entrada
```javascript
// Todas as entradas são validadas
- Descrição: 2-60 caracteres, sem HTML
- Valor: número positivo, 0.01-999.999.999
- Porcentagem: 0-100, soma = 100%
- Nome meta: 2-40 caracteres
```

#### LocalStorage
- Dados não sensíveis (apenas finanças locais)
- Validação ao carregar
- Fallback em caso de erro

### Performance

#### Otimizações
- ✅ Event delegation
- ✅ Memoização de seletores
- ✅ Redução de reflows/repaints
- ✅ CSS Grid para layout
- ✅ SVG para gráficos
- ✅ CSS variables para temas

#### Metrics
- First Paint: ~100ms
- Interactivity: ~200ms
- Total Bundle: ~40KB (minificado)

### Acessibilidade (WCAG 2.1 AA)

#### Semântica
```html
✅ <header>, <nav>, <section>, <article>
✅ <button>, <input>, <label>
✅ <h1>, <h2>, <h3> hierarquia
```

#### ARIA
```html
✅ aria-label para ícones
✅ aria-live para notificações
✅ role="region" para áreas
✅ aria-atomic para atualizações
```

#### Teclado
```
✅ Tab navigation
✅ Enter para ações
✅ Alt+1/2/3 para abas
✅ Alt+T para tema
```

#### Cores
```
✅ Contraste mínimo 4.5:1
✅ Não depende só de cor
✅ Modo escuro incluído
```

### Mobile First

#### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

#### Safe Area
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

#### Touch
```css
min-width: 44px;  /* Touch target */
min-height: 44px;
touch-action: manipulation;
```

### Responsividade

```css
/* Mobile First */
.app { padding: 14px; }

/* Small screens */
@media (max-width: 360px) { /* iPhone SE */ }

/* Landscape */
@media (max-height: 500px) and (orientation: landscape) { }

/* Tablet+ */
@media (min-width: 520px) { }
```

### Temas

#### Light Theme
```css
--bg: #f4f6fa
--surface: #ffffff
--text: #0a2540
--brand: #059669
```

#### Dark Theme
```css
--bg: #040b14
--surface: #0a1726
--text: #f8fafc
--brand: #10b981
```

### Animações

#### Smooth Transitions
```css
transition: transform 0.15s ease;
transition: opacity 0.3s;
```

#### Keyframes
```css
@keyframes fadeUp { }
@keyframes slideIn { }
```

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
}
```

## 🧪 Testing

### Testes Manuais

```javascript
// Abrir console (F12) e rodar:

// Listar estado
console.log(state);

// Adicionar transação
state.transactions.push({
  id: uid(),
  type: 'income',
  description: 'Test',
  amount: 100,
  date: new Date().toISOString()
});
saveState();
renderAll();

// Limpar dados
localStorage.removeItem('patrimonio_app_v1');
location.reload();
```

### Casos de Uso

- [ ] Adicionar receita
- [ ] Adicionar despesa
- [ ] Excluir transação
- [ ] Editar porcentagens
- [ ] Criar meta
- [ ] Adicionar R$ 100 na meta
- [ ] Excluir meta
- [ ] Alternar tema
- [ ] Resetar dados
- [ ] Testar offline (DevTools > Network > Offline)
- [ ] Testar mobile (DevTools > Device Toolbar)

## 🔍 Debugging

### Console API
```javascript
console.log('%c💰 Debug', 'color: green; font-weight: bold;');
console.error('Erro capturado');
console.warn('Aviso');
```

### DevTools
```
1. F12 abrir DevTools
2. Console para logs
3. Application para localStorage
4. Network para requisições
5. Performance para métricas
6. Accessibility para verificação
```

### Erros Comuns

```javascript
// ❌ Descrição muito longa
"Este é um texto muito longo que excede o limite"
// ✅ Erro mostrado: "Máximo 60 caracteres"

// ❌ Valor inválido
"abc"
// ✅ Erro mostrado: "Valor inválido"

// ❌ Soma ≠ 100%
[25, 25, 25]  // Soma = 75%
// ✅ Erro mostrado: "Soma deve ser 100% (atual: 75%)"
```

## 📈 Melhorias Futuras

- [ ] Exportar dados (JSON/CSV)
- [ ] Importar dados
- [ ] Sincronização cloud
- [ ] Gráficos de tendência
- [ ] Categorias customizáveis
- [ ] Orçamento por categoria
- [ ] Relatórios
- [ ] Notificações de alerta
- [ ] Dark mode automático
- [ ] Múltiplos usuários
- [ ] API backend
- [ ] Autenticação

## 📚 Recursos

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev](https://web.dev/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Can I Use](https://caniuse.com/)

---

**Documentação v1.0 - Última atualização: 2026-06-15**
