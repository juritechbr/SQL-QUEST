// ============================================================
// SQL QUEST — Motor do Jogo
// ============================================================

class SQLQuestEngine {
  constructor() {
    this.db = null;
    this.progresso = this.carregarProgresso();
    this.faseAtual = null;
    this.missaoAtual = null;
  }

  // ─── Banco de Dados ──────────────────────────────────────
  async inicializarDB() {
    const SQL = await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}` });
    this.db = new SQL.Database();
    this.db.run(DB_SCHEMA);
    this.db.run(DB_DATA);
    return true;
  }

  executarSQL(sql) {
    try {
      const results = this.db.exec(sql);
      if (!results || results.length === 0) return { sucesso: true, colunas: [], linhas: [], total: 0 };
      const { columns, values } = results[0];
      return { sucesso: true, colunas: columns, linhas: values || [], total: (values || []).length };
    } catch (err) {
      return { sucesso: false, erro: this.traduzirErro(err.message), colunas: [], linhas: [] };
    }
  }

  traduzirErro(msg) {
    if (msg.includes('no such table')) {
      const t = msg.match(/no such table: (\w+)/);
      return `Tabela "${t?.[1]}" não existe. Verifique o nome da tabela!`;
    }
    if (msg.includes('no such column')) {
      const c = msg.match(/no such column: ([\w.]+)/);
      return `Coluna "${c?.[1]}" não encontrada. Verifique o nome da coluna!`;
    }
    if (msg.includes('syntax error')) return 'Erro de sintaxe SQL. Revise o comando!';
    if (msg.includes('incomplete input')) return 'Comando incompleto. Verifique a estrutura!';
    return msg;
  }

  verificarResposta(sqlAluno, missao) {
    const normalizar = s => s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/;$/, '');
    const aluno = normalizar(sqlAluno);
    const correto = normalizar(missao.solucao);
    const aceitas = (missao.solucoes_aceitas || []).map(normalizar);

    // Verificação exata
    if (aluno === correto || aceitas.includes(aluno)) {
      const resultado = this.executarSQL(sqlAluno);
      return { correto: true, resultado };
    }

    // Verificação semântica — executa ambas e compara resultados
    try {
      const resAluno = this.executarSQL(sqlAluno);
      const resCorreta = this.executarSQL(missao.solucao);
      if (resAluno.sucesso && resCorreta.sucesso) {
        const alunoStr = JSON.stringify({ c: resAluno.colunas.map(c=>c.toLowerCase()), l: resAluno.linhas });
        const corretaStr = JSON.stringify({ c: resCorreta.colunas.map(c=>c.toLowerCase()), l: resCorreta.linhas });
        if (alunoStr === corretaStr) return { correto: true, resultado: resAluno };
      }
    } catch (e) {}

    const resultado = this.executarSQL(sqlAluno);
    return { correto: false, resultado };
  }

  // ─── Progresso ───────────────────────────────────────────
  carregarProgresso() {
    try {
      const p = localStorage.getItem('sqlquest_progresso');
      return p ? JSON.parse(p) : this.progressoInicial();
    } catch { return this.progressoInicial(); }
  }

  progressoInicial() {
    return {
      xp: 0,
      nivel: 1,
      titulo: 'Aprendiz',
      fasesDesbloqueadas: [1],
      missoesCompletas: [],
      fasesConcluidas: [],
      conquistas: []
    };
  }

  salvarProgresso() {
    localStorage.setItem('sqlquest_progresso', JSON.stringify(this.progresso));
  }

  resetarProgresso() {
    this.progresso = this.progressoInicial();
    this.salvarProgresso();
  }

  completarMissao(missaoId, xp) {
    if (this.progresso.missoesCompletas.includes(missaoId)) return false;
    this.progresso.missoesCompletas.push(missaoId);
    this.adicionarXP(xp);
    this.salvarProgresso();
    return true;
  }

  completarFase(faseId) {
    if (!this.progresso.fasesConcluidas.includes(faseId)) {
      this.progresso.fasesConcluidas.push(faseId);
    }
    const proxima = faseId + 1;
    if (proxima <= FASES.length && !this.progresso.fasesDesbloqueadas.includes(proxima)) {
      this.progresso.fasesDesbloqueadas.push(proxima);
    }
    this.salvarProgresso();
  }

  adicionarXP(xp) {
    this.progresso.xp += xp;
    this.atualizarNivel();
  }

  atualizarNivel() {
    const niveis = [
      { min: 0,    max: 200,  nivel: 1, titulo: 'Aprendiz' },
      { min: 200,  max: 500,  nivel: 2, titulo: 'Estudante' },
      { min: 500,  max: 1000, nivel: 3, titulo: 'Iniciado' },
      { min: 1000, max: 1800, nivel: 4, titulo: 'Mago SQL' },
      { min: 1800, max: 2800, nivel: 5, titulo: 'Feiticeiro' },
      { min: 2800, max: 9999, nivel: 6, titulo: 'Arquimago' },
    ];
    const n = niveis.find(n => this.progresso.xp >= n.min && this.progresso.xp < n.max) || niveis[niveis.length-1];
    this.progresso.nivel = n.nivel;
    this.progresso.titulo = n.titulo;
  }

  getMissaoConcluida(id) { return this.progresso.missoesCompletas.includes(id); }
  getFaseConcluida(id) { return this.progresso.fasesConcluidas.includes(id); }
  getFaseDesbloqueada(id) { return this.progresso.fasesDesbloqueadas.includes(id); }

  getProgressoFase(fase) {
    const total = fase.missoes.length;
    const completas = fase.missoes.filter(m => this.getMissaoConcluida(m.id)).length;
    return { completas, total, pct: Math.round((completas / total) * 100) };
  }

  getXPProximoNivel() {
    const tabela = [0, 200, 500, 1000, 1800, 2800, 9999];
    const idx = this.progresso.nivel;
    return { atual: this.progresso.xp, proximo: tabela[idx] || 9999, base: tabela[idx-1] || 0 };
  }

  // Verificar se fase foi toda concluída
  verificarConclusaoFase(fase) {
    const todas = fase.missoes.every(m => this.getMissaoConcluida(m.id));
    if (todas && !this.getFaseConcluida(fase.id)) {
      this.completarFase(fase.id);
      return true; // recém concluída
    }
    return false;
  }
}

// Instância global
const engine = new SQLQuestEngine();
