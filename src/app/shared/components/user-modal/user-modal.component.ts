import { UserModel } from './../../../features/home/home.model';
import { ApiService } from 'src/app/shared/api.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from "@angular/core";
import { NgxMaskModule } from 'ngx-mask';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  formValue !: FormGroup;
  userModel: UserModel = new UserModel();
  btnAdd !: boolean;
  btnUpdate !: boolean;
  cpf !: string;

  constructor(public dialogRef: MatDialogRef<UserModalComponent>,
    private formbuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formValue = this.formbuilder.group({
      nome: [''],
      cpf: [''],
      dataNascimento: [''],
      renda: [''],
      email: ['']
    })
    
    this.btnAdd = data.btnAdd;
    this.btnUpdate = data.btnUpdate;
    this.userModel.id = data.data.id;
    this.formValue.controls['nome'].setValue(data.data.nome);
    this.formValue.controls['cpf'].setValue(data.data.cpf);
    this.formValue.controls['dataNascimento'].setValue(data.data.dataNascimento);
    this.formValue.controls['renda'].setValue(data.data.renda);
    this.formValue.controls['email'].setValue(data.data.email);
  }

  ngOnInit(): void {}

    getAllUsers() {
      this.api.getUsers()
      .subscribe(res=>{
        this.data = res;
      })
    }
    postUserDetails() {
      var date = new Date();
      this.userModel.nome = this.formValue.value.nome;
      this.userModel.cpf = this.formValue.value.cpf;
      this.userModel.dataNascimento = this.formValue.value.dataNascimento;
      this.userModel.renda = this.formValue.value.renda;
      this.userModel.email = this.formValue.value.email;
      this.userModel.dataCadastro =  date.toLocaleString();
      this.api.postUser(this.userModel)
      .subscribe(res=>{
        console.log(res);
        alert("Usuário cadastrado com sucesso!");
        let ref = document.getElementById('cancelar');
        ref?.click();
        this.formValue.reset();
        this.getAllUsers();
      },
      err=>{
        alert("Ops... alguma coisa deu errada");
      })
    }
    updateUserDetails() {
      this.userModel.nome = this.formValue.value.nome;
      this.userModel.cpf = this.formValue.value.cpf;
      this.userModel.dataNascimento = this.formValue.value.dataNascimento;
      this.userModel.renda = this.formValue.value.renda;
      this.userModel.email = this.formValue.value.email;
  
      this.api.updateUser(this.userModel, this.userModel.id)
      .subscribe(res=>{
        alert("Usuário atualizado com sucesso!");
        let ref = document.getElementById('cancelar');
        ref?.click();
        this.formValue.reset();
        this.getAllUsers();
      })    
    }

    goBackHandler() {
      this.dialogRef.close();
      this.getAllUsers();
    }

    isCPF(): boolean{
      return this.userModel.cpf == null ? true : this.userModel.cpf.length < 12 ? true : false;
   }
   
   getCpfCnpjMask(): string{
      return this.isCPF() ? '000.000.000-009' : '00.000.000/0000-00';
   }
}
