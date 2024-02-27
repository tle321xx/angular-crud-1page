import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from './models/user.model';

interface Genders {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'email',
    'gender',
    'phone',
    'major',
    'date',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public allUser: Array<any> = [];

  public userForm!: FormGroup;

  public majors: string[] = ['Airport', 'Cargo', 'ATC', 'Logistic'];

  public actionBtn: string = 'save';

  public users!: User[];

  public userIdToUpdate!: number;

  public isUpdateActive: boolean = false;

  // กลุ่มนี้ทำงานด้วยกัน
  
  public genders: Genders[] = [
    { value: 'M', viewValue: 'Male' },
    { value: 'F', viewValue: 'Female' },
  ];
  public tooltipContent: string = '';
  public showGenderTooltip: boolean = false;

  public selectedGender!: string;
  // selectedGender เอาไว้ใช้หลังๆ

  constructor(private fb: FormBuilder, private api: ApiService) {
    // for (let i = 0; i < this.allUser.length; i++) {
    //   console.log(this.allUser[i]);
    // }

  }

  ngOnInit(): void {
    this.getAllUsers();
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      major: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  get Email() {
    return this.userForm.controls['email'].value;
  }

  addUser() {
    // มีแค่ตรงนี้มันก็บันทึกแล้ว
    this.api.postUser(this.userForm.value).subscribe({
      // console.log(res);
      // แต่เราต้องการให้มันรีเซทฟอร์มพร้อมกับแสดงผลเลยทันที
      next: (res) => {
        alert('Success');
        this.getAllUsers();
        this.userForm.reset();
      },
      error: () => {
        alert('Fail');
      },
    });
  }

  editUser(id: number) {
    this.userIdToUpdate = id;
    if (this.userIdToUpdate !== undefined) {
      this.api.getUserId(this.userIdToUpdate).subscribe({
        next: (res) => {
          this.isUpdateActive = true;
          this.fillFormToUpdate(res as User);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  updateUser(){
    this.api.putUser(this.userForm.value, this.userIdToUpdate).subscribe({
      next: (res) => {
        alert('Update User Successfully')
        this.userForm.reset()
        this.isUpdateActive = false; // Reset the update state
        this.getAllUsers(); // Fetch the updated data
      },
      error: (error)=>{
        alert('Update User Error')
      }
    })
  }

  deleteUser(i: number) {
    this.api.deleteUser(i).subscribe({
      next: (res) => {
        alert('Delete User Successfully');
        this.getAllUsers()
      },
      error: (error)=> {
        console.log(error)
        alert("Error in deleting user");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllUsers() {
    this.api.getUser().subscribe({
      next: (res) => {
        this.users = res;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (res) => {
        alert('Error while fetching users');
      },
    });
  }

  fillFormToUpdate(user: User) {
    this.userForm.patchValue({
      firstName: user.firstName || '',
      email: user.email || '',
      gender: user.gender || '',
      phone: user.phone || '',
      major: user.major || '',
      date: user.date || '',
    });
  }

  showGender(gender: string) {
    this.showGenderTooltip = true;
    this.tooltipContent = gender === 'M' ? 'Male' : 'Female';
  }

  hideGenderTooltip() {
    this.showGenderTooltip = false;
  }
}
