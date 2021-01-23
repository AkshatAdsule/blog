import { Observable } from 'rxjs';
import { Post } from 'src/types/post';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  private articleID: string;
  public article: Observable<Post>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.articleID = this.route.snapshot.params['id'];
    console.log(this.articleID);
    this.article = this.afs
      .collection('posts')
      .doc<Post>(this.articleID)
      .valueChanges();
  }
}
