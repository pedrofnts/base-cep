
#  Projeto BaseCEP

  

##  Descrição

  

Script em Node.js para baixar, descompactar e processar arquivos CSV de CEPs dos estados brasileiros do projeto [CEP Aberto](https://www.cepaberto.com/). Converte os dados em arquivos JSON individuais para cada estado e um arquivo JSON unificado com todos os CEPs do Brasil.

  

##  Pré-Requisitos

  

- Node.js

- Acesso aos cookies de sessão do site CEP Aberto

  

##  Configuração e Execução

  

```bash

# Clone o repositório

$  git  clone [URL_DO_REPOSITORIO]

# Acesse o diretório do projeto

$  cd [NOME_DO_DIRETORIO]

# Instale as dependências

$  npm  install

 
# Crie um arquivo .env na raiz do projeto com os cookies de sessão

# Exemplo:

# SESSION_COOKIE='valor_do_cookie_aqui'


# Execute o script

$  node  main.js
```

Considere doar para o [CEP Aberto](https://www.cepaberto.com/): pix@cepaberto.com