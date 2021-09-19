import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, Image,Modal } from 'react-native';
import Constants from 'expo-constants';

async function executeGet(url,jsonState){
    //get síncrono com o uso do fetch
    await fetch(url)
    .then(response => {
          if (response.status === 200) {
            console.log('sucesso');
            response.json().then(function(result){ 

              //console.log(result);
              jsonState(result)

              });
          } else {
            throw new Error('Erro ao consumir a API!');
          }
      })
      .then(response => {
        //console.debug(response);
      }).catch(error => {
        console.error(error);
      });
  }

const ShowDetalhes = ({display,toogleModal,mensagem}) => (   
    <Modal
          animationType="slide"
          transparent={true}
          visible={display}
          onRequestClose={toogleModal}
    >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
                <Pressable onPress={toogleModal}>
                  <Text>{mensagem}</Text>
                </Pressable>
          </View>
        </View>
    
    </Modal>
        
 )

const Pessoa = ({nome,email,link}) => {

    //state para controle do Modal
    const [modal,setModal] = React.useState(false)

    function mudaModal(){
      setModal(!modal)
    }

    return(
    <View>
      <ShowDetalhes display={modal} toogleModal={mudaModal} mensagem={email}/>
      
      <Pressable onPress={mudaModal}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: link,
          }}
        />

        <Text style={styles.paragraph}>{nome}</Text>
      </Pressable>
    </View>
    )
}




export default function App() {

  const [jsonData,setJsonData] = React.useState({})

  executeGet("https://reqres.in/api/users?page=2",setJsonData)

  //função que renderiza cada item do FlatList
  function meuItem({item}){
    let nomeCompleto = item.first_name + " " + item.last_name
    
    return(
      <Pessoa nome={nomeCompleto} 
              link={item.avatar}
              email={item.email}
      />
    )
  }
  

  return (

    <View style={styles.container}>

      <FlatList
        data={jsonData.data}
        renderItem={meuItem}
        ListHeaderComponent={()=><Text style={styles.header}>Lista de Usuários</Text>}
        keyExtractor={item => item.id}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  paragraph: {
    margin: 5,
    padding: 5,
    textAlign: 'center',
    fontSize: 20
  },
  tinyLogo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    borderRadius: 50
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header:{
    margin: 5,
    padding: 5,
    textAlign: 'center',
    fontSize: 30,
    backgroundColor: "#B0C4DE",
  }
});
