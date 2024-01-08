import { UserModalComponent } from './../../shared/components/user-modal/user-modal.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';
import { UserModel } from './home.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  formValue !: FormGroup;
  userModel: UserModel = new UserModel();
  data !: any;
  btnAdd !: boolean;
  btnUpdate !: boolean;

  constructor(private formbuilder: FormBuilder,
              private api: ApiService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
      this.formValue = this.formbuilder.group({
        titulo: [''],
        diretor: [''],
        genero: [''],
        ano: [''],
        descricao: [''],
        poster: ['']
    })
    this.getAllUsers();
  }
  clickAddUser(data: any){    
     const dialogRef = this.dialog.open(UserModalComponent, {
      panelClass: "custom-dialog-container",
      width: "900px",
      data: {data: data, btnAdd: true, btnUpdate: false}
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });

    this.formValue.reset();
  }

  getAllUsers() {
    this.api.getUsers()
    .subscribe(res=>{
      this.data = res;
    })
  }

  deleteUser(data: any){
    this.api.deleteUser(data.id)
    .subscribe(res=>{
      alert("Usuário deletado!");
      this.getAllUsers();
    })
  }

  editUser(data: any){
    const dialogRef = this.dialog.open(UserModalComponent, {
      panelClass: "custom-dialog-container",
      width: "900px",
      data: {data: data, btnAdd: false, btnUpdate: true}
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
    
    this.userModel.id = data.id;
    this.formValue.controls['nome'].setValue(data.nome);
    this.formValue.controls['cpf'].setValue(data.cpf);
    this.formValue.controls['dataNasimento'].setValue(data.dataNascimento);
    this.formValue.controls['renda'].setValue(data.renda);
    this.formValue.controls['email'].setValue(data.email);
  }

}
