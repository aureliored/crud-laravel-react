import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import 'primeflex/primeflex.css';
import ReactDOM from "react-dom";
import ReactModal from 'react-modal';

import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import UserService from "../service/UserService";

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const DataTableUser = () => {

  const emptyUser = {
    id: null,
    name: "",
    cpf: "",
    phone: "",
    pass: "",
    birthdate: ""
  };

  const [users, setUsers] = useState(null);
  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalUserDelete, setOpenModalUserDelete] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);

  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);
  const userService = new UserService();


  useEffect(() => {
    userService.getUsers().then((data) => setUsers(data));
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setUser(emptyUser);
    setOpenModalUser(true);
  };

  const hideModal = (save) => {
    if(save === true){
      setOpenModalUser(false);
    }else{
      setOpenModalUserDelete(false);
    }
  }

  const cpfMask = value => {
    var x = value
            .replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
    return !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '-' + x[4] ;
  };

  const phoneMask = value => {
    var x = value
            .replace(/\D/g, '').match(/(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})/);
    return '(' + (!x[2] ? x[1] : x[1]) + ')' + x[2] + ' ' + x[3] + '.' + x[4] ;
  };

  const dateMask = value => {
    var x = value
            .replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
    return !x[2] ? x[1] : x[1] + '/' + x[2] + '/' + x[3] ;
  };
  const cnpjMask = value => {
    var x = value
            .replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
    return !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
  };

  const maskField = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if(name === 'cpf'){

      if(value.length <= 14){
        console.log('cpf')
        e.target.value = cpfMask(e.target.value);
      }else if (value.length > 14) {
        console.log('cnpj')
        e.target.value = cnpjMask(e.target.value);
      }
    }

    if(name === 'phone') {
      e.target.value = phoneMask(e.target.value);
    }

    if(name === 'birthdate') {
      e.target.value = dateMask(e.target.value);
    }
  }

  /**
  * Service
  */

  const saveUser = (user) => {

    if (user.id) {
      userService.updateUsers(user,user.id)
        .then((data) => {
          if(data.data.response !== 'success'){
            returnRequest(true,1)
          }
        }).finally(() => {
          userService.getUsers().then((data) => setUsers(data));
          returnRequest(false,1)
          setOpenModalUser(false);
        });
    }else{
      userService.createUsers(user)
        .then((data) => {
          if(data.data.response !== 'success'){
            returnRequest(true,1)
          }
        }).finally(() => {
          userService.getUsers().then((data) => setUsers(data));
          returnRequest(false,1)
          setOpenModalUser(false);
        });
    }


    setUser(emptyUser);
  };

  const deleteUser = () => {
    let _user = { ...user };

    userService.deleteUsers(_user.id)
      .then((data) => {
        console.log(data.data.response);
        if(data.data.response !== 'success'){
          returnRequest(true)
        }
      }).finally(() => {
        userService.getUsers().then((data) => setUsers(data));
        setOpenModalUserDelete(false);
        returnRequest(false)
      });

    setSelectedUsers(null);
  };

  const returnRequest = (error, tipo) => {
    let message = {
      save: "Operação concluida com sucesso!",
      error: "Ops! Algo deu errado. Entre em contato com o administrador do sistema."
    };
    if(error === false){
      alert(message.save);
    }else{
      alert(message.error);
    }
  };


  const editUser = (user) => {
    setUser({ ...user });
    setOpenModalUser(true);
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setOpenModalUserDelete(true);
  };



  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Novo"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={openNew}
        />

      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Exportar"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Listagem de usuários</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Procuar..."
        />
      </span>
    </div>
  );


  return (

    <div className="datatable-users">
      <div className="card">
        <Toolbar
          className="p-mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={users}
          selection={selectedUsers}
          onSelectionChange={(e) => setSelectedUsers(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Usuários"
          globalFilter={globalFilter}
          header={header}
        >

          <Column field="name" header="Nome" sortable></Column>
          <Column field="cpf" header="CPF/CNPJ" sortable></Column>
          <Column field="phone" header="Telefone" sortable></Column>
          <Column field="pass" header="Senha" sortable></Column>
          <Column
            field="birthdate"
            header="Data de nacimento"
            sortable
          ></Column>

          <Column body={actionBodyTemplate}></Column>
        </DataTable>
        <ReactModal className="ReactModal__Content" isOpen={openModalUser}>
          <Formik
            initialValues={user}
            enableReinitialize
            validationSchema={Yup.object({
              name: Yup.string()
               .required('O nome é obrigatório'),
             cpf: Yup.string()
               .required('O campo CPF/CNPJ é obrigatório'),
             phone: Yup.string()
               .required('O telefone é obrigatório'),
             pass: Yup.string()
               .required('A senha é obrigatório'),
             birthdate: Yup.string()
               .required('A data de nacimento é obrigatória'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              saveUser(values);
            }}
          >

            <Form>
            <div className="p-fluid">
                <div className="p-field">
                <label htmlFor="name" >Nome</label>
                <Field name="name" default={user.name} type="text" />
                <ErrorMessage name="name" />
                </div>
                <div className="p-field">
                <label htmlFor="cpf" >CPF/CNPJ</label>
                <Field name="cpf" type="text" onKeyUp={e => maskField(e)} placeholder="___.___.___-__" />
                <ErrorMessage name="cpf" />
                </div>
                <div className="p-field">

                <label htmlFor="phone" >Telefone</label>
                <Field name="phone" onKeyUp={e => maskField(e)} placeholder="(__)_________" type="text" />
                <ErrorMessage name="phone" />
                </div>
                <div className="p-field">
                <label htmlFor="pass">Senha</label>
                <Field name="pass" type="text" />
                <ErrorMessage name="pass" />
                </div>
                <div className="p-field">
                <label htmlFor="birthdate">Data de nacimento</label>
                <Field name="birthdate" onKeyUp={e => maskField(e)} type="text" />
                <ErrorMessage name="birthdate" />
                </div>

              </div>
              <React.Fragment>
                <Button
                  label="Cancelar"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() => {hideModal(true)}}
                />
                <Button
                  label="Salvar"
                  icon="pi pi-check"
                  className="p-button-text"
                  type="submit"
                />
              </React.Fragment>
            </Form>
          </Formik>
        </ReactModal>


        <ReactModal className="ReactModal__Content_dell" isOpen={openModalUserDelete}>
          <h3>Deletar usuário</h3>
          <div className="confirmation-content">
            {user && (
              <span>
                Você esta deletando o usuário <b>{user.name}</b>, deseja continuar?
              </span>
            )}
          </div>
          <React.Fragment>
            <Button
              label="Não"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {hideModal(false)}}
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              className="p-button-text"
              onClick={deleteUser}
            />
          </React.Fragment>
        </ReactModal>
      </div>
    </div>


  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<DataTableUser />, rootElement);

export default DataTableUser;
