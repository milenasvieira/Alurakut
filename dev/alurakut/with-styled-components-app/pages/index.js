import React from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from './src/components/MainGrid/'
import Box from './src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from './src/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from './src/components/ProfileRelations'

function ProfileSideBar(propriedades) {
  return (
    <Box as='aside'>
      <img src= {`https://github.com/${propriedades.gitHubUser}.png`} style = {{ borderRadius: '8px'}}/>
      <hr/>
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.gitHubUser}`}>
          @{propriedades.gitHubUser}
        </a>
      </p>
      <hr/>

      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {/*{seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`/users/${itemAtual}`}>
                <img src={`https://github.com/${itemAtual}.png`}/>
                <span>{itemAtual}</span>
              </a>
            </li>
          )
          })}*/}
      </ul>  
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const gitHubUser = 'milenasvieira';
  const [comunidades, setComunidades] = React.useState([]);
  const favoritePersons = [
  'rodrigoMacknight', 
  'omariosouto', 
  'peas', 
  'juunegreiros', 
  'thayanavt', 
  'rafaballerini'
]

const [seguidores, setSeguidores] = React.useState([]);
//Pegar o array de followers do github
  React.useEffect(function(){
    fetch('https://api.github.com/users/milenasvieira/followers')
    .then(function(respostaDoServidor){
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta){
      setSeguidores(respostaCompleta);
    })

    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '654ed6a9b574735d7caba52b277714',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allComunidades {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e j?? retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allComunidades;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })
    // .then(function (response) {
    //   return response.json()
    // })

  }, [])

  console.log('seguidores antes do return', seguidores);

// 1- Criar um box que vai ter um map que vai receber os items do array da API do github



  return (
    <>
      <AlurakutMenu/>
      <MainGrid>
        <div className = "profileArea" style = {{ gridArea: 'profileArea;'}}>
          <ProfileSideBar gitHubUser = {gitHubUser}/>
        </div>
        <div className = "welcomeArea" style = {{ gridArea: 'welcomeArea;'}}>
          <Box>
            <h1 className = "title">
              Bem vindo(a), {gitHubUser}!
            </h1>

            <OrkutNostalgicIconSet/>
          </Box>
          <Box>
            <h2 className="subTitle">O que voc?? deseja fazer?</h2>
                <form onSubmit={function handleCreateCommunity(e){
                  e.preventDefault();
                  const dadosDoForm = new FormData(e.target);

                  const comunidade = {
                    title: dadosDoForm.get('title'),
                    imageUrl: dadosDoForm.get('image'),
                    creatorSlug: gitHubUser,
                  };

                  fetch('/api/comunidades', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(comunidade)
                  })
                  .then(async (response) => {
                    const dados = await response.json();
                    console.log(dados.registroCriado);
                    const comunidade = dados.registroCriado;
                    const comunidadesAtualizadas = [...comunidades, comunidade];
                    setComunidades(comunidadesAtualizadas);
                  })
                }}>
                  <div>
                    <input 
                    placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                    type="text"
                  />
                  </div>
                  <div>
                    <input 
                    placeholder="Coloque uma URL para usarmos de capa."
                    name="image"
                    aria-label="Coloque uma URL para usarmos de capa."
                  />
                  </div>

                  <button>
                    Criar comunidade
                  </button>
                </form>
          </Box>
        </div>
        <div className = "profileRelationsArea" style = {{ gridArea: 'profileRelationsArea;'}}>
          <ProfileRelationsBox title="Seguidores" items={seguidores}/>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({favoritePersons.length})
            </h2>

            <ul>
              {favoritePersons.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`}/>
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
                })}
            </ul>  
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
                {comunidades.map((itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                      <a href={`/comunidades/${itemAtual.id}`}>
                        <img src={itemAtual.imageUrl}/>
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  )
                  })}
              </ul> 
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const gitHubUser = decodedToken?.gitHubUser;

  if (!githubUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      gitHubUser
    },
  }
}