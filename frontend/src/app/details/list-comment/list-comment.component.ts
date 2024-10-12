import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Comment } from '../../core/models/comment.model';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { CommentsService } from '../../core/services/comment.service';

@Component({
    selector: 'app-list-comment',
    templateUrl: './list-comment.component.html',
    styleUrls: ['./list-comment.component.css'],
})
export class ListCommentComponent implements OnInit, OnDestroy {

    @Input() slug!: string;
    comments: Comment[] = [];
    @Output() editComment = new EventEmitter<Comment>();
    @Output() createCommentEvent = new EventEmitter<void>();

    subscription!: Subscription;
    currentUser!: User;
    isAddingComment: boolean = false;

    constructor(
        private userService: UserService,
        private commentsService: CommentsService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadComments();
        this.subscription = this.userService.currentUser.subscribe(
            (userData: User) => {
                this.currentUser = userData;
                this.cd.markForCheck();
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    loadComments() {
        this.commentsService.getAll(this.slug).subscribe((comments: Comment[]) => {
            this.comments = comments;
            this.cd.markForCheck();
        });
    }

    canModify(comment: Comment): boolean {
        return this.currentUser.username === comment.author.username;
    }

    createComment() {
        this.createCommentEvent.emit();
    }

    deleteClicked(comment: Comment) {
        this.commentsService.destroy(comment.id, this.slug).subscribe(() => {
            this.comments = this.comments.filter(c => c.id !== comment.id);
        });
    }

    editClicked(comment: Comment) {
        this.editComment.emit(comment);
    }

    hasWrittenComment(): boolean {
        return this.comments.some(comment => this.canModify(comment));
    }

    showCommentForm() {
        this.isAddingComment = true;
    }

    onCommentSubmitted() {
        this.isAddingComment = false;
        this.loadComments();
    }
}