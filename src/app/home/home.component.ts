import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Post } from 'src/types/post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public posts: Observable<Post[]>;
  constructor(private firestore: AngularFirestore) {
    this.posts = this.firestore.collection<Post>('posts').valueChanges();
  }

  ngOnInit(): void {}
}
