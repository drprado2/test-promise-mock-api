import React, { Component } from 'react';
import './App.css';
import {ApiBase, CrudBase, FetchMock} from 'promise-mock-api';

const tableName = 'clients';

class App extends Component {
  state={
    clientes: null,
    salvandoCliente: false,
    name: '',
    age: '',
    updatingId: null,
    fatchingData: false,
    deleting: false,
    filtro: {
      name: '',
      age: ''
    }
  }

  componentWillMount(){
    this.buscarRegistros();
  }

  changeForm = e => {
    const newState = {...this.state};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  changeFiltro = e => {
    const newFiltro = {...this.state.filtro};
    newFiltro[e.target.name] = e.target.value;
    this.setState(state => ({...state, filtro: newFiltro}));
  }

  deletar = id => {
    this.setState({deleting: true})
   FetchMock.delete(tableName, id)
     .then(() =>{
       this.setState({deleting: false})
       this.buscarRegistros();
     });
  }

  onUpdate = id => {
    const registerToUpdate = this.state.clientes.find(x => x.id == id);
    this.setState({name: registerToUpdate.name, age: registerToUpdate.age, updatingId: registerToUpdate.id});
  }

  clearForm = () => this.setState({name: '', age: ''})

  saveClient = () => {
    const client = {name: this.state.name, age: this.state.age};
    this.setState({salvandoCliente: true});
    if(!this.state.updatingId) {
      this.addCliente(client);
      return;
    }

    this.updateClient(client, this.state.updatingId);
  }

  buscarRegistros = () => {
    this.setState({fetchingData: true, clientes: null})
    const filtro = {...this.state.filtro};
    if(filtro.age === '')
      delete filtro.age;
    FetchMock.get(tableName, filtro)
      .then(x => x.json())
      .then(x => this.setState({clientes: x.data, fetchingData: false}));
  }

  addCliente = client => {
    console.log("Vindo salvar", client)
    FetchMock.post(tableName, client)
      .then(() =>{
        this.setState({salvandoCliente: false});
        this.clearForm();
        this.buscarRegistros();
      });
  }

  updateClient = (client, id) => {
    console.log("Vindo atualizar", client, id)
    FetchMock.put(tableName,id, client)
      .then(() =>{
        this.setState({salvandoCliente: false});
        this.clearForm();
        this.buscarRegistros();
      });
  }

  render() {
    return (
      <div className="App">
        <div style={{position: 'relative', width: '500px',  margin: '20px auto', border: '1px solid black', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {this.state.salvandoCliente &&
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 999, backgroundColor: 'rgba(30,30,30,0.9)', color: 'white', width: '100%', borderRadius: '10px', height: '100%', fontWeight: 'bold', fontSize: '2em'}}>Carregando...</div>
          }
          <h1>Cadastrar Cliente</h1>
          <hr style={{width: '100%'}}/>
          <div style={{marginBottom: '5px'}}>
            <label htmlFor="name">Nome:  </label>
            <input style={{marginLeft: '8px', height: '2em', width: '400px'}} type="text" name="name" id="name" value={this.state.name} onChange={this.changeForm} />
          </div>
          <div>
            <label htmlFor="age">Idade: </label>
            <input style={{marginLeft: '10px', height: '2em', width: '400px'}} type="number" name="age" id="age" value={this.state.age} onChange={this.changeForm} />
          </div>
          <button style={{cursor: 'pointer', width: '470px', height: '2em', marginTop: '10px', marginBottom: '20px'}} onClick={this.saveClient}>Salvar</button>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '895px', border: '1px solid black',  margin: '0 auto', marginBottom: '20px'}}>
          <h1 style={{padding: 0, margin: 0}}>Filtros</h1>
          <hr style={{width: '100%'}}/>
          <div style={{display: 'flex', flexDirection: 'row'}} >
            <div style={{marginBottom: '10px', marginLeft: '20px', marginRight: '10px'}}>
              <label htmlFor="filter-name">Nome:  </label>
              <input style={{marginLeft: '8px', height: '2em', width: '400px'}} type="text" name="name" id="filter-name" value={this.state.filtro.name} onChange={this.changeFiltro} />
            </div>
            <div>
              <label htmlFor="filter-age">Idade: </label>
              <input style={{marginLeft: '10px', height: '2em', width: '400px'}} type="number" name="age" id="filter-age" value={this.state.filtro.age} onChange={this.changeFiltro} />
            </div>
          </div>
          <button onClick={this.buscarRegistros} style={{cursor: 'pointer', marginBottom: '20px', marginLeft: '40px', width: '200px', height: '2em'}}>Buscar</button>
        </div>
        {this.state.fetchingData &&
          <h1>Carregando...</h1>
        }
        {this.state.deleting &&
        <h1>Deletando...</h1>
        }
        {this.state.clientes &&
          <table>
            <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {this.state.clientes.map((x, i) =>
              <tr key={i}>
                <td>{x.id}</td>
                <td>{x.name}</td>
                <td>{x.age}</td>
                <td><button style={{backgroundColor: 'red', fontWeight: 'bold', cursor: 'pointer', borderColor: 'red', marginRight: '5px'}} onClick={() => this.deletar(x.id)} >Excluír</button><button style={{backgroundColor: 'blue', fontWeight: 'bold', cursor: 'pointer', borderColor: 'blue'}} onClick={() => this.onUpdate(x.id)} >Editar</button></td>
              </tr>
            )
            }
            </tbody>
          </table>
        }
      </div>
    );
  }
}

export default App;
