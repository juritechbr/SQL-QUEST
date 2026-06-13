// ============================================================
// SQL QUEST — Banco de Dados do Reino de Dataria
// Simula um banco relacional inteiro no navegador via SQL.js
// ============================================================

const DB_SCHEMA = `
CREATE TABLE herois (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  classe TEXT,
  nivel INTEGER,
  forca INTEGER,
  magia INTEGER,
  vida INTEGER,
  guilda_id INTEGER,
  ativo INTEGER
);

CREATE TABLE guildas (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  cidade TEXT,
  membros INTEGER,
  ouro INTEGER
);

CREATE TABLE missoes (
  id INTEGER PRIMARY KEY,
  titulo TEXT,
  tipo TEXT,
  dificuldade TEXT,
  recompensa INTEGER,
  heroi_id INTEGER,
  completa INTEGER
);

CREATE TABLE itens (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  tipo TEXT,
  raridade TEXT,
  valor INTEGER,
  heroi_id INTEGER,
  poder INTEGER
);

CREATE TABLE batalhas (
  id INTEGER PRIMARY KEY,
  local TEXT,
  heroi_id INTEGER,
  inimigo TEXT,
  resultado TEXT,
  dano_causado INTEGER,
  data_batalha TEXT
);
`;

const DB_DATA = `
INSERT INTO guildas VALUES
(1,'Guardiões do Amanhecer','Valdoria',12,8500),
(2,'Filhos da Tempestade','Aranthos',8,5200),
(3,'Ordem do Cristal','Miravel',15,12000),
(4,'Lobos das Sombras','Darkfen',6,3100),
(5,'Cavaleiros do Sol','Solaris',20,18000);

INSERT INTO herois VALUES
(1,'Aldric','Guerreiro',15,85,20,320,1,1),
(2,'Lyra','Maga',12,30,95,180,3,1),
(3,'Theron','Arqueiro',8,60,45,250,2,1),
(4,'Seraphina','Paladina',20,75,70,400,5,1),
(5,'Vex','Assassino',6,70,30,150,4,1),
(6,'Morgana','Feiticeira',18,25,110,200,3,1),
(7,'Drak','Bárbaro',10,95,10,380,2,1),
(8,'Elara','Druida',14,50,80,290,1,1),
(9,'Zorn','Necromante',9,20,100,160,4,0),
(10,'Brann','Guerreiro',3,40,15,200,5,1);

INSERT INTO missoes VALUES
(1,'Resgatar o Cristal Perdido','exploração','difícil',500,2,1),
(2,'Limpar a Floresta Negra','combate','médio',250,3,0),
(3,'Defender Valdoria','defesa','fácil',150,1,1),
(4,'Encontrar o Dragão','combate','épico',1000,4,0),
(5,'Roubar o Grimório','furtividade','difícil',400,5,1),
(6,'Curar a Praga','magia','médio',300,6,1),
(7,'Destruir a Fortaleza','combate','épico',800,7,0),
(8,'Guardar o Portal','defesa','fácil',120,8,1),
(9,'Invocar Sombras','magia','difícil',450,9,0),
(10,'Primeira Missão','exploração','fácil',50,10,1);

INSERT INTO itens VALUES
(1,'Espada do Amanhecer','arma','épico',1200,1,90),
(2,'Cajado Lunar','arma','raro',800,2,85),
(3,'Arco Sussurrante','arma','raro',750,3,70),
(4,'Armadura Solar','armadura','épico',1500,4,50),
(5,'Adaga das Sombras','arma','incomum',400,5,60),
(6,'Anel de Fogo','acessório','raro',600,6,40),
(7,'Machado de Guerra','arma','incomum',350,7,80),
(8,'Cajado da Natureza','arma','raro',700,8,75),
(9,'Tomo Sombrio','arma','raro',650,9,78),
(10,'Espada Enferrujada','arma','comum',80,10,20),
(11,'Poção de Vida','consumível','comum',50,1,0),
(12,'Escudo de Carvalho','armadura','incomum',300,4,30);

INSERT INTO batalhas VALUES
(1,'Floresta Negra',1,'Ogro','vitória',120,'2024-01-15'),
(2,'Cavernas de Gelo',2,'Lich','vitória',95,'2024-01-20'),
(3,'Planícies do Norte',3,'Goblin','vitória',45,'2024-02-01'),
(4,'Torre Sombria',4,'Dragão','derrota',0,'2024-02-10'),
(5,'Mercado Negro',5,'Guarda','vitória',30,'2024-02-15'),
(6,'Vila Maldita',6,'Zumbi','vitória',60,'2024-02-18'),
(7,'Montanha do Trovão',7,'Gigante','vitória',200,'2024-03-01'),
(8,'Portal Eterno',8,'Demônio','vitória',110,'2024-03-05'),
(9,'Necropolis',1,'Esqueleto','vitória',75,'2024-03-10'),
(10,'Arena Real',4,'Campeão','vitória',180,'2024-03-15');
`;

// Fases e missões do jogo
const FASES = [
  {
    id: 1,
    titulo: "SELECT Simples",
    subtitulo: "Explore o Reino de Dataria",
    descricao: "Aprenda a consultar tabelas e selecionar colunas. Toda magia SQL começa com um SELECT!",
    icone: "🔍",
    cor: "#22c55e",
    corBg: "#f0fdf4",
    xp: 100,
    missoes: [
      {
        id: "1-1",
        tipo: "leitura",
        titulo: "Listar todos os heróis",
        historia: "O Rei de Dataria quer conhecer todos os heróis do reino. Execute o feitiço para invocar a lista completa!",
        instrucao: "Selecione TODAS as colunas da tabela <code>herois</code>.",
        dica: "Use o asterisco (*) para selecionar todas as colunas.",
        solucao: "SELECT * FROM herois",
        solucoes_aceitas: ["select * from herois", "select* from herois"],
        xp: 20,
        tabela_principal: "herois"
      },
      {
        id: "1-2",
        tipo: "completar",
        titulo: "Nome e classe dos heróis",
        historia: "O arauto precisa de apenas o nome e a classe de cada herói para o anúncio real.",
        instrucao: "Selecione apenas as colunas <code>nome</code> e <code>classe</code> da tabela <code>herois</code>.",
        dica: "Separe os nomes das colunas com vírgula.",
        solucao: "SELECT nome, classe FROM herois",
        solucoes_aceitas: ["select nome, classe from herois", "select nome,classe from herois"],
        xp: 25,
        tabela_principal: "herois"
      },
      {
        id: "1-3",
        tipo: "livre",
        titulo: "Missão: Inventário do Reino",
        historia: "O Ministro do Tesouro precisa ver todos os itens do reino para calcular a riqueza total.",
        instrucao: "Selecione <code>nome</code>, <code>tipo</code> e <code>valor</code> da tabela <code>itens</code>.",
        dica: "FROM seguido do nome da tabela determina de onde vêm os dados.",
        solucao: "SELECT nome, tipo, valor FROM itens",
        solucoes_aceitas: ["select nome, tipo, valor from itens", "select nome,tipo,valor from itens"],
        xp: 30,
        tabela_principal: "itens"
      },
      {
        id: "1-4",
        tipo: "desafio",
        titulo: "Desafio: Mapa das Guildas",
        historia: "O cartógrafo real precisa mapear todas as guildas do reino com suas cidades.",
        instrucao: "Selecione <code>nome</code> e <code>cidade</code> da tabela <code>guildas</code>.",
        dica: "Não esqueça: SELECT [colunas] FROM [tabela]",
        solucao: "SELECT nome, cidade FROM guildas",
        solucoes_aceitas: ["select nome, cidade from guildas", "select nome,cidade from guildas"],
        xp: 25,
        tabela_principal: "guildas"
      }
    ]
  },
  {
    id: 2,
    titulo: "WHERE",
    subtitulo: "Filtre seus inimigos com precisão",
    descricao: "Use condições para encontrar exatamente o que procura. O WHERE é o coração de todo filtro!",
    icone: "⚔️",
    cor: "#0ea5e9",
    corBg: "#f0f9ff",
    xp: 150,
    missoes: [
      {
        id: "2-1",
        tipo: "leitura",
        titulo: "Heróis guerreiros",
        historia: "Apenas os Guerreiros foram convocados para a Batalha do Norte. Filtre os escolhidos!",
        instrucao: "Selecione todos os heróis cuja <code>classe</code> seja igual a 'Guerreiro'.",
        dica: "Use WHERE coluna = 'valor' para filtrar por texto.",
        solucao: "SELECT * FROM herois WHERE classe = 'Guerreiro'",
        solucoes_aceitas: ["select * from herois where classe = 'guerreiro'", "select* from herois where classe='guerreiro'"],
        xp: 30,
        tabela_principal: "herois"
      },
      {
        id: "2-2",
        tipo: "livre",
        titulo: "Heróis poderosos",
        historia: "Somente heróis de nível 10 ou acima podem entrar na Sala do Conselho.",
        instrucao: "Selecione <code>nome</code> e <code>nivel</code> dos heróis com <code>nivel</code> maior ou igual a 10.",
        dica: "Use >= para 'maior ou igual'.",
        solucao: "SELECT nome, nivel FROM herois WHERE nivel >= 10",
        solucoes_aceitas: ["select nome, nivel from herois where nivel >= 10", "select nome,nivel from herois where nivel>=10"],
        xp: 35,
        tabela_principal: "herois"
      },
      {
        id: "2-3",
        tipo: "livre",
        titulo: "Itens épicos do reino",
        historia: "O armeiro real quer ver apenas os itens de raridade épica para o inventário especial.",
        instrucao: "Selecione <code>nome</code>, <code>tipo</code> e <code>valor</code> dos itens com <code>raridade</code> = 'épico'.",
        dica: "Textos em SQL precisam de aspas simples: 'épico'",
        solucao: "SELECT nome, tipo, valor FROM itens WHERE raridade = 'épico'",
        solucoes_aceitas: ["select nome, tipo, valor from itens where raridade = 'épico'", "select nome,tipo,valor from itens where raridade='épico'"],
        xp: 35,
        tabela_principal: "itens"
      },
      {
        id: "2-4",
        tipo: "desafio",
        titulo: "Desafio: Missões incompletas",
        historia: "O Comandante das Missões quer ver todas as missões ainda não concluídas. O campo 'completa' vale 0 para missões abertas.",
        instrucao: "Selecione <code>titulo</code> e <code>dificuldade</code> das missões onde <code>completa</code> = 0.",
        dica: "Números não precisam de aspas: WHERE numero = 0",
        solucao: "SELECT titulo, dificuldade FROM missoes WHERE completa = 0",
        solucoes_aceitas: ["select titulo, dificuldade from missoes where completa = 0", "select titulo,dificuldade from missoes where completa=0"],
        xp: 50,
        tabela_principal: "missoes"
      }
    ]
  },
  {
    id: 3,
    titulo: "Funções Agregadas",
    subtitulo: "Conte os tesouros do reino",
    descricao: "COUNT, SUM, AVG, MAX e MIN — as funções que transformam listas em respostas poderosas!",
    icone: "💰",
    cor: "#f59e0b",
    corBg: "#fffbeb",
    xp: 200,
    missoes: [
      {
        id: "3-1",
        tipo: "leitura",
        titulo: "Quantos heróis existem?",
        historia: "O Censo do Reino quer saber quantos heróis estão registrados no Grimório.",
        instrucao: "Conte o total de registros na tabela <code>herois</code> usando <code>COUNT(*)</code>.",
        dica: "COUNT(*) conta todas as linhas da tabela.",
        solucao: "SELECT COUNT(*) FROM herois",
        solucoes_aceitas: ["select count(*) from herois"],
        xp: 35,
        tabela_principal: "herois"
      },
      {
        id: "3-2",
        tipo: "livre",
        titulo: "Total de ouro das guildas",
        historia: "O Tesoureiro Real precisa saber quanto ouro existe no total entre todas as guildas.",
        instrucao: "Some todos os valores de <code>ouro</code> da tabela <code>guildas</code> usando <code>SUM</code>.",
        dica: "SUM(coluna) soma todos os valores daquela coluna.",
        solucao: "SELECT SUM(ouro) FROM guildas",
        solucoes_aceitas: ["select sum(ouro) from guildas"],
        xp: 40,
        tabela_principal: "guildas"
      },
      {
        id: "3-3",
        tipo: "livre",
        titulo: "Nível médio dos heróis",
        historia: "O Sábio do Reino quer saber qual é o nível médio dos heróis para calibrar as missões.",
        instrucao: "Calcule a média do campo <code>nivel</code> na tabela <code>herois</code> usando <code>AVG</code>.",
        dica: "AVG(coluna) calcula a média aritmética.",
        solucao: "SELECT AVG(nivel) FROM herois",
        solucoes_aceitas: ["select avg(nivel) from herois"],
        xp: 40,
        tabela_principal: "herois"
      },
      {
        id: "3-4",
        tipo: "desafio",
        titulo: "Desafio: O herói mais forte",
        historia: "Quem tem a maior força no reino? Encontre o valor máximo de força entre todos os heróis.",
        instrucao: "Use <code>MAX</code> para encontrar o maior valor de <code>forca</code> na tabela <code>herois</code>.",
        dica: "MAX(coluna) retorna o maior valor. MIN(coluna) retorna o menor.",
        solucao: "SELECT MAX(forca) FROM herois",
        solucoes_aceitas: ["select max(forca) from herois"],
        xp: 85,
        tabela_principal: "herois"
      }
    ]
  },
  {
    id: 4,
    titulo: "GROUP BY",
    subtitulo: "Organize a guilda por categorias",
    descricao: "Agrupe dados e descubra padrões escondidos. O GROUP BY é essencial para análises!",
    icone: "🛡️",
    cor: "#8b5cf6",
    corBg: "#f5f3ff",
    xp: 200,
    missoes: [
      {
        id: "4-1",
        tipo: "leitura",
        titulo: "Heróis por classe",
        historia: "O General precisa saber quantos heróis existem em cada classe para organizar os batalhões.",
        instrucao: "Conte heróis agrupados por <code>classe</code>. Mostre <code>classe</code> e <code>COUNT(*)</code>.",
        dica: "GROUP BY agrupa linhas com o mesmo valor. Use junto com funções agregadas.",
        solucao: "SELECT classe, COUNT(*) FROM herois GROUP BY classe",
        solucoes_aceitas: ["select classe, count(*) from herois group by classe", "select classe,count(*) from herois group by classe"],
        xp: 40,
        tabela_principal: "herois"
      },
      {
        id: "4-2",
        tipo: "livre",
        titulo: "Ouro por tipo de raridade",
        historia: "O joalheiro quer saber o valor total de itens em cada categoria de raridade.",
        instrucao: "Some o <code>valor</code> dos itens agrupados por <code>raridade</code>.",
        dica: "SELECT raridade, SUM(valor) FROM itens GROUP BY raridade",
        solucao: "SELECT raridade, SUM(valor) FROM itens GROUP BY raridade",
        solucoes_aceitas: ["select raridade, sum(valor) from itens group by raridade", "select raridade,sum(valor) from itens group by raridade"],
        xp: 45,
        tabela_principal: "itens"
      },
      {
        id: "4-3",
        tipo: "livre",
        titulo: "Missões por tipo",
        historia: "O Conselho quer ver quantas missões existem de cada tipo para planejar os próximos meses.",
        instrucao: "Conte missões agrupadas por <code>tipo</code>. Mostre <code>tipo</code> e o total.",
        dica: "COUNT(*) conta as linhas dentro de cada grupo.",
        solucao: "SELECT tipo, COUNT(*) FROM missoes GROUP BY tipo",
        solucoes_aceitas: ["select tipo, count(*) from missoes group by tipo", "select tipo,count(*) from missoes group by tipo"],
        xp: 45,
        tabela_principal: "missoes"
      },
      {
        id: "4-4",
        tipo: "desafio",
        titulo: "Desafio: Nível médio por classe",
        historia: "O Treinador Real quer saber qual classe tem o maior nível médio para ajustar o treinamento.",
        instrucao: "Calcule o <code>AVG(nivel)</code> por <code>classe</code> na tabela <code>herois</code>.",
        dica: "Combine AVG() com GROUP BY para médias por grupo.",
        solucao: "SELECT classe, AVG(nivel) FROM herois GROUP BY classe",
        solucoes_aceitas: ["select classe, avg(nivel) from herois group by classe", "select classe,avg(nivel) from herois group by classe"],
        xp: 70,
        tabela_principal: "herois"
      }
    ]
  },
  {
    id: 5,
    titulo: "HAVING",
    subtitulo: "Qualifique os melhores grupos",
    descricao: "Filtre grupos após a agregação. HAVING é o WHERE dos grupos!",
    icone: "⭐",
    cor: "#ec4899",
    corBg: "#fdf2f8",
    xp: 250,
    missoes: [
      {
        id: "5-1",
        tipo: "leitura",
        titulo: "Classes com mais de 2 heróis",
        historia: "Somente classes com pelo menos 3 representantes podem ter um capitão nomeado.",
        instrucao: "Mostre classes e contagem, filtrando apenas as que têm mais de 2 heróis.",
        dica: "HAVING filtra grupos: GROUP BY classe HAVING COUNT(*) > 2",
        solucao: "SELECT classe, COUNT(*) FROM herois GROUP BY classe HAVING COUNT(*) > 2",
        solucoes_aceitas: ["select classe, count(*) from herois group by classe having count(*) > 2", "select classe,count(*) from herois group by classe having count(*)>2"],
        xp: 55,
        tabela_principal: "herois"
      },
      {
        id: "5-2",
        tipo: "livre",
        titulo: "Raridades com valor total alto",
        historia: "O Banco do Reino só aceita categorias de itens que somem mais de 1000 em ouro.",
        instrucao: "Agrupe itens por <code>raridade</code>, some o valor e mostre apenas grupos com <code>SUM(valor) > 1000</code>.",
        dica: "HAVING vem depois do GROUP BY e usa funções agregadas.",
        solucao: "SELECT raridade, SUM(valor) FROM itens GROUP BY raridade HAVING SUM(valor) > 1000",
        solucoes_aceitas: ["select raridade, sum(valor) from itens group by raridade having sum(valor) > 1000", "select raridade,sum(valor) from itens group by raridade having sum(valor)>1000"],
        xp: 65,
        tabela_principal: "itens"
      },
      {
        id: "5-3",
        tipo: "desafio",
        titulo: "Desafio: Tipos de missão com alta recompensa",
        historia: "O Guilda dos Aventureiros só lista tipos de missão que, em média, pagam 300 ou mais de recompensa.",
        instrucao: "Agrupe missões por <code>tipo</code>, calcule <code>AVG(recompensa)</code> e filtre os que têm média >= 300.",
        dica: "HAVING AVG(recompensa) >= 300",
        solucao: "SELECT tipo, AVG(recompensa) FROM missoes GROUP BY tipo HAVING AVG(recompensa) >= 300",
        solucoes_aceitas: ["select tipo, avg(recompensa) from missoes group by tipo having avg(recompensa) >= 300", "select tipo,avg(recompensa) from missoes group by tipo having avg(recompensa)>=300"],
        xp: 130,
        tabela_principal: "missoes"
      }
    ]
  },
  {
    id: 6,
    titulo: "ORDER BY",
    subtitulo: "Organize o ranking de batalha",
    descricao: "Ordene resultados de forma crescente ou decrescente. O ORDER BY dá ordem ao caos!",
    icone: "🏆",
    cor: "#f97316",
    corBg: "#fff7ed",
    xp: 250,
    missoes: [
      {
        id: "6-1",
        tipo: "leitura",
        titulo: "Heróis por nível",
        historia: "O Ranking dos Heróis exige que os mais poderosos apareçam primeiro!",
        instrucao: "Selecione <code>nome</code> e <code>nivel</code> dos heróis, ordenados por <code>nivel</code> de forma <code>DESC</code>.",
        dica: "ORDER BY coluna DESC ordena do maior para o menor.",
        solucao: "SELECT nome, nivel FROM herois ORDER BY nivel DESC",
        solucoes_aceitas: ["select nome, nivel from herois order by nivel desc", "select nome,nivel from herois order by nivel desc"],
        xp: 45,
        tabela_principal: "herois"
      },
      {
        id: "6-2",
        tipo: "livre",
        titulo: "Itens mais valiosos",
        historia: "O Leiloeiro Real quer listar os itens do mais caro ao mais barato.",
        instrucao: "Selecione <code>nome</code> e <code>valor</code> dos itens, ordenados por <code>valor</code> decrescente.",
        dica: "DESC = decrescente (maior para menor). ASC = crescente (menor para maior, padrão).",
        solucao: "SELECT nome, valor FROM itens ORDER BY valor DESC",
        solucoes_aceitas: ["select nome, valor from itens order by valor desc", "select nome,valor from itens order by valor desc"],
        xp: 50,
        tabela_principal: "itens"
      },
      {
        id: "6-3",
        tipo: "livre",
        titulo: "Guildas por ouro",
        historia: "A Nobreza quer ver o ranking de riqueza das guildas, da mais rica para a mais pobre.",
        instrucao: "Selecione <code>nome</code> e <code>ouro</code> das guildas, ordenadas por <code>ouro</code> decrescente.",
        dica: "Combine SELECT, FROM e ORDER BY DESC.",
        solucao: "SELECT nome, ouro FROM guildas ORDER BY ouro DESC",
        solucoes_aceitas: ["select nome, ouro from guildas order by ouro desc", "select nome,ouro from guildas order by ouro desc"],
        xp: 50,
        tabela_principal: "guildas"
      },
      {
        id: "6-4",
        tipo: "desafio",
        titulo: "Desafio: Top heróis mágicos",
        historia: "O Círculo dos Magos quer ver apenas heróis com magia acima de 50, do mais mágico para o menos.",
        instrucao: "Selecione <code>nome</code> e <code>magia</code> dos heróis com <code>magia > 50</code>, ordenados por <code>magia DESC</code>.",
        dica: "Combine WHERE para filtrar e ORDER BY para ordenar.",
        solucao: "SELECT nome, magia FROM herois WHERE magia > 50 ORDER BY magia DESC",
        solucoes_aceitas: ["select nome, magia from herois where magia > 50 order by magia desc", "select nome,magia from herois where magia>50 order by magia desc"],
        xp: 105,
        tabela_principal: "herois"
      }
    ]
  },
  {
    id: 7,
    titulo: "JOIN",
    subtitulo: "Una as tabelas do reino",
    descricao: "Combine dados de múltiplas tabelas. O JOIN é a aliança mais poderosa do SQL!",
    icone: "🤝",
    cor: "#06b6d4",
    corBg: "#ecfeff",
    xp: 400,
    missoes: [
      {
        id: "7-1",
        tipo: "leitura",
        titulo: "Heróis e suas guildas",
        historia: "O Arauto precisa anunciar cada herói com o nome de sua guilda — dados de duas tabelas!",
        instrucao: "Junte <code>herois</code> com <code>guildas</code> usando <code>JOIN</code> onde <code>herois.guilda_id = guildas.id</code>. Mostre <code>herois.nome</code> e <code>guildas.nome</code>.",
        dica: "SELECT tabela1.coluna, tabela2.coluna FROM tabela1 JOIN tabela2 ON tabela1.fk = tabela2.pk",
        solucao: "SELECT herois.nome, guildas.nome FROM herois JOIN guildas ON herois.guilda_id = guildas.id",
        solucoes_aceitas: ["select herois.nome, guildas.nome from herois join guildas on herois.guilda_id = guildas.id", "select herois.nome,guildas.nome from herois join guildas on herois.guilda_id=guildas.id"],
        xp: 80,
        tabela_principal: "herois"
      },
      {
        id: "7-2",
        tipo: "livre",
        titulo: "Heróis e suas missões",
        historia: "O Escriba Real quer ver o nome de cada herói junto com o título de sua missão.",
        instrucao: "Junte <code>herois</code> com <code>missoes</code> onde <code>missoes.heroi_id = herois.id</code>. Mostre <code>herois.nome</code> e <code>missoes.titulo</code>.",
        dica: "Veja que desta vez a chave estrangeira está na tabela missoes.",
        solucao: "SELECT herois.nome, missoes.titulo FROM herois JOIN missoes ON missoes.heroi_id = herois.id",
        solucoes_aceitas: ["select herois.nome, missoes.titulo from herois join missoes on missoes.heroi_id = herois.id", "select herois.nome,missoes.titulo from herois join missoes on missoes.heroi_id=herois.id", "select herois.nome, missoes.titulo from herois join missoes on herois.id = missoes.heroi_id"],
        xp: 90,
        tabela_principal: "herois"
      },
      {
        id: "7-3",
        tipo: "desafio",
        titulo: "Desafio: Heróis, guildas e missões",
        historia: "O Grande Conselho quer um relatório completo: nome do herói, sua guilda e sua missão. Triple join!",
        instrucao: "Junte <code>herois</code>, <code>guildas</code> e <code>missoes</code>. Mostre <code>herois.nome</code>, <code>guildas.nome</code> e <code>missoes.titulo</code>.",
        dica: "Encadeie dois JOINs: FROM herois JOIN guildas ON ... JOIN missoes ON ...",
        solucao: "SELECT herois.nome, guildas.nome, missoes.titulo FROM herois JOIN guildas ON herois.guilda_id = guildas.id JOIN missoes ON missoes.heroi_id = herois.id",
        solucoes_aceitas: ["select herois.nome, guildas.nome, missoes.titulo from herois join guildas on herois.guilda_id = guildas.id join missoes on missoes.heroi_id = herois.id"],
        xp: 230,
        tabela_principal: "herois"
      }
    ]
  },
  {
    id: 8,
    titulo: "SUBSELECT",
    subtitulo: "A Missão Secreta do Arquimago",
    descricao: "Consultas dentro de consultas — o poder máximo do SQL! Você chegou ao chefe final.",
    icone: "🐉",
    cor: "#dc2626",
    corBg: "#fff1f2",
    xp: 600,
    missoes: [
      {
        id: "8-1",
        tipo: "leitura",
        titulo: "Heróis acima da média",
        historia: "O Dragão só pode ser derrotado por heróis com nível acima da média. Encontre-os com um subselect!",
        instrucao: "Selecione heróis cujo <code>nivel</code> seja maior que a média de todos os níveis usando um subselect.",
        dica: "WHERE nivel > (SELECT AVG(nivel) FROM herois)",
        solucao: "SELECT nome, nivel FROM herois WHERE nivel > (SELECT AVG(nivel) FROM herois)",
        solucoes_aceitas: ["select nome, nivel from herois where nivel > (select avg(nivel) from herois)", "select nome,nivel from herois where nivel>(select avg(nivel) from herois)"],
        xp: 150,
        tabela_principal: "herois"
      },
      {
        id: "8-2",
        tipo: "livre",
        titulo: "Itens dos heróis de alto nível",
        historia: "Quais itens pertencem aos heróis que têm nível maior que 10? Use um subselect para descobrir.",
        instrucao: "Selecione <code>nome</code> dos itens onde <code>heroi_id</code> está na lista de heróis com <code>nivel > 10</code>.",
        dica: "WHERE heroi_id IN (SELECT id FROM herois WHERE nivel > 10)",
        solucao: "SELECT nome FROM itens WHERE heroi_id IN (SELECT id FROM herois WHERE nivel > 10)",
        solucoes_aceitas: ["select nome from itens where heroi_id in (select id from herois where nivel > 10)", "select nome from itens where heroi_id in(select id from herois where nivel>10)"],
        xp: 200,
        tabela_principal: "itens"
      },
      {
        id: "8-3",
        tipo: "desafio",
        titulo: "Chefe Final: O Grimório Secreto",
        historia: "Para derrotar o Dragão Ancião, você precisa encontrar heróis que participaram de batalhas com vitória. Esta é a consulta final que provará que você é um verdadeiro Arquimago SQL!",
        instrucao: "Selecione <code>nome</code> dos heróis cujo <code>id</code> está entre os <code>heroi_id</code> de batalhas com <code>resultado = 'vitória'</code>.",
        dica: "WHERE id IN (SELECT heroi_id FROM batalhas WHERE resultado = 'vitória')",
        solucao: "SELECT nome FROM herois WHERE id IN (SELECT heroi_id FROM batalhas WHERE resultado = 'vitória')",
        solucoes_aceitas: ["select nome from herois where id in (select heroi_id from batalhas where resultado = 'vitória')", "select nome from herois where id in(select heroi_id from batalhas where resultado='vitória')"],
        xp: 250,
        tabela_principal: "herois"
      }
    ]
  }
];
