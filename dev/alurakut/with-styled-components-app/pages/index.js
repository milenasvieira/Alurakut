import React from 'react'
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
  const [comunidades, setComunidades] = React.useState([{
    id: '83483742386429387427',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
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
            <h2 className="subTitle">O que você deseja fazer?</h2>
                <form onSubmit={function handleCreateCommunity(e){
                  e.preventDefault();
                  const dadosDoForm = new FormData(e.target);

                  const comunidade = {
                    id: new Date().toISOString(),
                    title: dadosDoForm.get('title'),
                    image: dadosDoForm.get('image')
                  };

                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
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
                      <a href={`/users/${itemAtual.title}`}>
                        <img src={itemAtual.image}/>
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
