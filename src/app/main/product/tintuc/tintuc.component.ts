import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-tintuc',
  templateUrl: './tintuc.component.html',
  styleUrls: ['./tintuc.component.css']
})
export class TintucComponent extends BaseComponent implements OnInit {
  public tintucs: any;
  public tintuc: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this._api.get('/api/TinTuc/get-all').takeUntil(this.unsubscribe).subscribe(data => {
      this.tintucs = data;
    }); 
  }

  loadPage(page) { 
    this._api.post('/api/tintucs/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.tintucs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/tintucs/search',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value, taikhoan: this.formsearch.get('taikhoan').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.tintucs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
        return {matkhau: true};
    }
  }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           image_url:data_image,
           hoten:value.hoten,
           diachi:value.diachi,
           gioitinh:value.gioitinh,
           email:value.email,
           taikhoan:value.taikhoan,
           matkhau:value.matkhau,
           role:value.role,
           ngaysinh:value.ngaysinh           
          };
        this._api.post('/api/tintucs/create-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           image_url:data_image,
           hoten:value.hoten,
           diachi:value.diachi,
           gioitinh:value.gioitinh,
           email:value.email,
           taikhoan:value.taikhoan,
           matkhau:value.matkhau,
           role:value.role,
           ngaysinh:value.ngaysinh ,
           tintuc_id:this.tintuc.tintuc_id,          
          };
        this._api.post('/api/tintucs/update-tintuc',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/tintucs/delete-tintuc',{tintuc_id:row.tintuc_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.tintuc = null;
    this.formdata = this.fb.group({
      'hoten': ['', Validators.required],
      'ngaysinh': [this.today, Validators.required],
      'diachi': [''],
      'gioitinh': [this.genders[0].value, Validators.required],
      'email': ['', [Validators.required,Validators.email]],
      'taikhoan': ['', Validators.required],
      'matkhau': ['', [this.pwdCheckValidator]],
      'nhaplaimatkhau': ['', Validators.required],
      'role': [this.roles[0].value, Validators.required],
    }, {
      validator: MustMatch('matkhau', 'nhaplaimatkhau')
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.tintuc = null;
    setTimeout(() => {
      $('#createtintucModal').modal('toggle');
      this.formdata = this.fb.group({
        'hoten': ['', Validators.required],
        'ngaysinh': ['', Validators.required],
        'diachi': [''],
        'gioitinh': ['', Validators.required],
        'email': ['', [Validators.required,Validators.email]],
        'taikhoan': ['', Validators.required],
        'matkhau': ['', [this.pwdCheckValidator]],
        'nhaplaimatkhau': ['', Validators.required],
        'role': ['', Validators.required],
      }, {
        validator: MustMatch('matkhau', 'nhaplaimatkhau')
      });
      this.formdata.get('ngaysinh').setValue(this.today);
      this.formdata.get('gioitinh').setValue(this.genders[0].value); 
      this.formdata.get('role').setValue(this.roles[0].value);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createtintucModal').modal('toggle');
      this._api.get('/api/tintucs/get-by-id/'+ row.tintuc_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.tintuc = res; 
        let ngaysinh = new Date(this.tintuc.ngaysinh);
          this.formdata = this.fb.group({
            'hoten': [this.tintuc.hoten, Validators.required],
            'ngaysinh': [ngaysinh, Validators.required],
            'diachi': [this.tintuc.diachi],
            'gioitinh': [this.tintuc.gioitinh, Validators.required],
            'email': [this.tintuc.email, [Validators.required,Validators.email]],
            'taikhoan': [this.tintuc.taikhoan, Validators.required],
            'matkhau': [this.tintuc.matkhau, [this.pwdCheckValidator]],
            'nhaplaimatkhau': [this.tintuc.matkhau, Validators.required],
            'role': [this.tintuc.role, Validators.required],
          }, {
            validator: MustMatch('matkhau', 'nhaplaimatkhau')
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createtintucModal').closest('.modal').modal('hide');
  }
}

