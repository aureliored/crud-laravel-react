import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import 'primeflex/primeflex.css';
// import "../index.css";
// import "./DataTable.css";
import ReactDOM from "react-dom";
import ReactModal from 'react-modal';

import toast, { Toaster } from 'react-hot-toast';

import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import UserService from "../service/UserService";

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
  const [openModalUsersDelete, setOpenModalUsersDelete] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const userService = new UserService();

  useEffect(() => { userService.getUsers().then((data) => setUsers(data));}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setOpenModalUser(true);
  };


  const hideModalUser = () => {
    setOpenModalUser(false);
  }
  const showModalUser = () => {
    setOpenModalUser(true);
  }

  const hideModalUserDelete = () => {
    setOpenModalUserDelete(false);
  }
  const showModalUserDelete = () => {
    setOpenModalUserDelete(true);
  }

  const hideModalUsersDelete = () => {
    setOpenModalUsersDelete(false);
  }
  const showModalUsersDelete = () => {
    setOpenModalUsersDelete(true);
  }

  const saveUser = () => {
    let _user = { ...user };
    let _users = [...users];

    if (user.id) {
      const index = findIndexById(user.id);
      _users[index] = _user;
    }else{
      _user.id = createId();
      _users.push(_user);
    }

    setUsers(_users);
    setOpenModalUser(false);
    setUser(emptyUser);
  };

  const editUser = (user) => {
    setUser({ ...user });
    setOpenModalUser(true);
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setOpenModalUserDelete(true);
  };

  const deleteUser = () => {
    let _users = users.filter((val) => val.id !== user.id);
    setUsers(_users);
    setOpenModalUserDelete(false);
    setUser(emptyUser);
    alert('Usuário deletado.')
  };

  const deleteSelectedUsers = () => {
    let _users = users.filter((val) => !selectedUsers.includes(val));
    setUsers(_users);
    setOpenModalUsersDelete(false);
    setSelectedUsers(null);
    alert('Usuários deletados');
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = {...user};
        _user[`${name}`] = val;

        setUser(_user);
    }

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setOpenModalUsersDelete(true);
  };



  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Toaster/>
        <Button
          label="Novo"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={openNew}
        />
        <Button
          label="Deletar"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedUsers || !selectedUsers.length}
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
      <Toaster  />

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
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
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


        <ReactModal isOpen={openModalUser}>
          <h3>Detalhes do usuário</h3>
          <div className="p-fluid">
            <div className="p-field">
                     <label htmlFor="name">Name</label>
                     <InputText
                       id="name"
                       value={user.name}
                       onChange={(e) => onInputChange(e, "name")}
                       required
                       autoFocus
                       className={classNames({ "p-invalid": submitted && !user.name })}
                     />
                     {submitted && !user.name && (
                       <small className="p-error">Por favor informe o nome.</small>
                     )}
            </div>
            <div className="p-field">
                     <label htmlFor="cpf">CPF/CNPJ</label>
                     <InputText
                       id="cpf"
                       value={user.cpf}
                       onChange={(e) => onInputChange(e, "cpf")}
                       required
                       autoFocus
                       className={classNames({ "p-invalid": submitted && !user.cpf })}
                     />
                     {submitted && !user.cpf && (
                       <small className="p-error">Por favor informe o CPF ou CNPJ.</small>
                     )}
            </div>
            <div className="p-field">
                     <label htmlFor="phone">Telefone</label>
                     <InputText
                       id="phone"
                       value={user.phone}
                       onChange={(e) => {onInputChange(e, "phone")}}
                       required
                       autoFocus
                       className={classNames({ "p-invalid": submitted && !user.phone })}
                     />
                     {submitted && !user.phone && (
                       <small className="p-error">Por favor informe o telefone.</small>
                     )}
            </div>
            <div className="p-field">
                     <label htmlFor="pass">Senha</label>
                     <InputText
                       id="pass"
                       value={user.pass}
                       onChange={(e) => onInputChange(e, "pass")}
                       required
                       autoFocus
                       className={classNames({ "p-invalid": submitted && !user.pass })}
                     />
                     {submitted && !user.pass && (
                       <small className="p-error">Por favor informe a senha.</small>
                     )}
            </div>
            <div className="p-field">
                     <label htmlFor="birthdate">Data de nacimento</label>
                     <InputText
                       id="birthdate"
                       value={user.birthdate}
                       onChange={(e) => onInputChange(e, "birthdate")}
                       required
                       autoFocus
                       className={classNames({
                         "p-invalid": submitted && !user.birthdate
                       })}
                     />
                     {submitted && !user.birthdate && (
                       <small className="p-error">
                         Por favor informe a data de nacimento.
                       </small>
                     )}
            </div>
          </div>
          <React.Fragment>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={hideModalUser}
            />
            <Button
              label="Salvar"
              icon="pi pi-check"
              className="p-button-text"
              onClick={saveUser}
            />
          </React.Fragment>
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
              onClick={hideModalUserDelete}
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              className="p-button-text"
              onClick={deleteUser}
            />
          </React.Fragment>
        </ReactModal>

        <ReactModal className="ReactModal__Content_dell" isOpen={openModalUsersDelete}>
          <h3>Deletar usuários</h3>
          <div className="confirmation-content">
            {user && <span>Tem certeza que deseja deletar esses usuários?</span>}
          </div>
          <React.Fragment>
            <Button
              label="Não"
              icon="pi pi-times"
              className="p-button-text"
              onClick={hideModalUsersDelete}
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              className="p-button-text"
              onClick={deleteSelectedUsers}
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
