import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public loginForm = new FormGroup({
    email: new FormControl('admin@blog.aksads.tech'),
    password: new FormControl(''),
  });

  public createPostForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    file: new FormControl(),
  });

  private file: any;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}
  ngOnInit(): void {
    document.getElementById('login-modal').style.display = 'block';
  }

  login() {
    this.auth
      .signInWithEmailAndPassword(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      .then((user) => {
        console.log('Logged in as ' + user.user.email);
        document.getElementById('login-modal').style.display = 'none';
      })
      .catch((error) => {
        console.log('Login Failed' + error);
        document.getElementById('login-error').style.display = 'block';
      });
  }

  createBlog() {
    // Has all fields filled out
    if (
      !!this.createPostForm.value.title &&
      !!this.createPostForm.value.description &&
      !!this.createPostForm.value.file
    ) {
      const filePath = `posts/${_.kebabCase(
        this.createPostForm.value.title
      )}.md`;
      const ref = this.afs.ref(filePath);
      this.afs.upload(filePath, this.file);
      ref
        .getDownloadURL()
        .toPromise()
        .then((url) => {
          this.firestore
            .collection('posts')
            .doc(_.kebabCase(this.createPostForm.value.title))
            .set({
              title: this.createPostForm.value.title,
              description: this.createPostForm.value.description,
              file_url: url,
              post_uri: `post/${_.kebabCase(this.createPostForm.value.title)}`,
              timestamp: new Date(),
            })
            .then(() => {
              document.getElementById('success').classList.remove('hidden');
            })
            .catch(() => {
              document.getElementById('error').classList.remove('hidden');
            });
        })
        .catch(() => {
          document.getElementById('error').classList.remove('hidden');
        });
    } else {
      document.getElementById('error').classList.remove('hidden');
    }
  }
  fileInputChange(event: { target: { files: any[] } }) {
    console.log(`setting file to ${event.target.files[0].name}`);
    this.file = event.target.files[0];
  }
}
