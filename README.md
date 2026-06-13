# ⚡ SQL Quest — Aprenda SQL jogando!

Um jogo educativo gamificado para aprender SQL do zero ao avançado, ambientado no **Reino de Dataria**.

## 🎮 Como jogar

O jogo funciona 100% no navegador — sem instalação, sem servidor, sem banco de dados externo.

**Fases disponíveis:**
1. 🔍 SELECT simples
2. ⚔️ WHERE
3. 💰 Funções agregadas (COUNT, SUM, AVG, MAX, MIN)
4. 🛡️ GROUP BY
5. ⭐ HAVING
6. 🏆 ORDER BY
7. 🤝 JOIN
8. 🐉 SUBSELECT (chefe final)

## 🚀 Hospedagem gratuita no GitHub Pages

### Passo a passo:

1. **Crie uma conta** no [github.com](https://github.com) (se ainda não tiver)

2. **Crie um repositório novo**
   - Clique em "New repository"
   - Nome sugerido: `sql-quest`
   - Marque como **Public**
   - Clique em "Create repository"

3. **Faça upload dos arquivos**
   - Na página do repositório, clique em "uploading an existing file"
   - Arraste todos os arquivos e pastas do projeto
   - Clique em "Commit changes"

4. **Ative o GitHub Pages**
   - Vá em **Settings** → **Pages**
   - Em "Source", selecione **Deploy from a branch**
   - Branch: **main**, pasta: **/ (root)**
   - Clique em **Save**

5. **Aguarde ~2 minutos** e acesse:
   ```
   https://SEU-USUARIO.github.io/sql-quest
   ```

### Alternativa: Netlify (ainda mais fácil)

1. Acesse [netlify.com](https://netlify.com) e faça login com GitHub
2. Clique em "Add new site" → "Deploy manually"
3. Arraste a pasta `sql-quest` para a área indicada
4. Pronto! Você recebe uma URL imediatamente.

## 🛠️ Estrutura do projeto

```
sql-quest/
├── index.html          # Página principal do jogo
├── css/
│   └── style.css       # Estilos completos (tema RPG medieval)
├── js/
│   ├── database.js     # Schema SQL + dados do Reino de Dataria
│   ├── engine.js       # Motor do jogo: SQL.js, progresso, XP
│   └── ui.js           # Interface: mapa, missões, editor SQL
└── README.md           # Este arquivo
```

## 🧠 Como funciona tecnicamente

- **SQL.js**: biblioteca que executa SQLite diretamente no navegador (WebAssembly). Não precisa de servidor!
- **LocalStorage**: o progresso do aluno é salvo automaticamente no navegador
- **Zero dependências de backend**: tudo é estático — funciona em qualquer hospedagem gratuita

## 📚 Banco de dados do Reino (tabelas disponíveis)

| Tabela | Colunas |
|--------|---------|
| `herois` | id, nome, classe, nivel, forca, magia, vida, guilda_id, ativo |
| `guildas` | id, nome, cidade, membros, ouro |
| `missoes` | id, titulo, tipo, dificuldade, recompensa, heroi_id, completa |
| `itens` | id, nome, tipo, raridade, valor, heroi_id, poder |
| `batalhas` | id, local, heroi_id, inimigo, resultado, dano_causado, data_batalha |

## 🎓 Para professores

O jogo aceita tanto a resposta exata quanto variações semanticamente equivalentes. Por exemplo:
- `SELECT * FROM herois` ✅
- `select * from herois` ✅ (case insensitive)
- `SELECT nome FROM herois` vs `SELECT nome, nivel FROM herois` ❌ (resultados diferentes)

O progresso fica salvo no `localStorage` do navegador de cada aluno.

## 📝 Licença

Livre para uso educacional. Sinta-se à vontade para adaptar!
