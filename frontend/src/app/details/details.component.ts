import { Component, OnInit } from '@angular/core';
import { Job } from '../core/models/job.model';
import { JobService } from '../core/services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../core/models/comment.model';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
    job!: Job;
    slug!: string | null;
    selectedComment!: Comment | null;

    constructor(
        private jobService: JobService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.slug = this.activatedRoute.snapshot.paramMap.get('slug');
        this.getJob();
    }

    getJob() {
        if (typeof this.slug === 'string') {
            this.jobService.get_job(this.slug).subscribe((data: any) => {
                this.job = data.jobs;
            });
        } else {
            this.router.navigate(['/']);
        }
    }

    onEditComment(comment: Comment) {
        this.selectedComment = comment;
    }

    onSubmitComment() {
        this.selectedComment = null;
    }
    onToggleFavorite(favorited: boolean) {
        this.job.favorited = favorited;

        if (favorited) {
            this.job.favoritesCount++;
        } else {
            this.job.favoritesCount--;
        }
    }
}