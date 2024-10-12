import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comment } from '../models/comment.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  constructor(private apiService: ApiService) {}

  add(slug: string, payload: { body: string }): Observable<Comment> {
    return this.apiService.post(`/${slug}/comments`, { comment: payload })
      .pipe(map(data => data.comment));
  }

  update(slug: string, commentId: number, payload: { body: string }): Observable<Comment> {
    return this.apiService.put(`/${slug}/comments/${commentId}`, { comment: payload })
      .pipe(map(data => data.comment));
  }

  getAll(slug: string): Observable<Comment[]> {
    return this.apiService.get(`/${slug}/comments`)
      .pipe(map(data => data.comments));
  }

  destroy(commentId: number, productSlug: string): Observable<void> {
    return this.apiService.delete(`/${productSlug}/comments/${commentId}`);
  }
}