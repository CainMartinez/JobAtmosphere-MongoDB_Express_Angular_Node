import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Job } from '../core/models/job.model';
import { JobService } from '../core/services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgControlStatusGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CarouselDetails } from '../core/models/carousel.model';


@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {

    job!: Job;
    //author!: Profile;
    slug!: string | null;
    @Input() page!: CarouselDetails[];
    // currentUser!: User;
    comments!: Comment[];
    user_image!: string;
    canModify!: boolean;
    cd: any;
    isSubmitting!: boolean;
    commentFormErrors!: {};
    commentControl = new FormControl();
    logged!: boolean;
    NoComments!: boolean;
    isDeleting!: boolean;
    

    constructor(
        private route : ActivatedRoute,
        private JobService: JobService,
        private ActivatedRoute: ActivatedRoute,
        private router: Router,
        // private ToastrService: ToastrService,
    ) { }

    ngOnInit(): void {

        // this.slug = this.ActivatedRoute.snapshot.paramMap.get('slug');
        this.route.data.subscribe(
            (data: any) => {
                this.slug = data.job.jobs.slug;
                this.job = data.job.jobs;
                // this.author = data.job.jobs.author
                // console.log(this.slug);
                // this.get_comments(this.slug);
                // this.get_user_author();
                // console.log(this.currentUser.username);
                // console.log(this.author.username);
                // if(this.currentUser.username === this.author.username){
                //     this.canModify = true;
                // } else {
                //     this.canModify = false;
                // }
        }
        );
        
        
        // this.UserService.isAuthenticated.subscribe(
        //     (data) => {
        //         this.logged = data;
        //         // console.log(this.logged, "logged");
        //     }
        // );
        // this.get_user_author();      
    }

    // get_job() {
    //     if (typeof this.slug === 'string') {
    //         this.JobService.get_job(this.slug).subscribe(
    //             (data : any) => {
    //                 this.job = data.jobs;
    //                 this.author = data.jobs.author
    //                 console.log(this.job.name);
    //                 this.get_comments(this.slug);
    //                 this.get_user_author();
    //                 // console.log(data.jobs);
    //             });
    //     }
    //     else{
    //         console.log('fallo al encontrar el jobo');
    //         this.router.navigate(['/']);
    //     }
    // }

    // onToggleFavorite(favorited: boolean) {
    //     this.job.favorited = favorited;
    
    //     if (favorited) {
    //         this.job.favoritesCount++;
    //     } else {
    //         this.job.favoritesCount--;
    //     }
    // }

    // onToggleFollow(following: boolean) {
    // this.author.following = following;
    //     // console.log(this.author.following);
    // }
//////////////////////////////////////////////////

// get_user_author() {
//     this.UserService.currentUser.subscribe(
//         (userData: User) => {
//             this.currentUser = userData;
//             this.user_image = this.currentUser.image;
//             // this.canModify = true;
//         }
//     );
// }

// get_comments(job_slug: any) {
//     // console.log(job_slug);
//     if (job_slug) {
//         this.CommentService.getAll(job_slug).subscribe((comments) => {
//             this.comments = comments;
//             // console.log(this.comments.length);
//             if (this.comments.length === 0) {
//                 console.log("No comments");
//                 this.NoComments = true;
//             }else{
//                 this.NoComments = false;
//             }
//         });
//     }
// }


// create_comment() {
//     this.isSubmitting = true;
//     this.commentFormErrors = {};
//     // console.log(this.commentControl.value);
//     if (this.job.slug) {
//         // console.log("yeeee");
//         const commentBody = this.commentControl.value;
//         // console.log(commentBody);
//         // console.log(this.job.slug);
//         this.CommentService.add(this.job.slug, commentBody).subscribe(
//             (data: any) => {
//                 console.log(data);
//                 // this.ToastrService.success("Comment added successfully");
//                 console.log("Comment added successfully");
//                 this.commentControl.reset('');
//                 this.isSubmitting = false;
//                 this.comments.push(data);
//                 window.location.reload();
//             });
//         }
//     }

// delete_comment(comment: Comment) {
//     // console.log(comment.id);
    
//     if (this.job.slug) {

//         this.CommentService.destroy(comment.id, this.slug).subscribe(
//             (data: any) => {
//                 // console.log(data);
//                 console.log("Comment deleted successfully");

//                 // this.ToastrService.success("Comment deleted successfully");
//                 console.log(this.comments);                
//                 this.comments = this.comments.filter((item) => item !== comment);
//             });
//     }
// }


// deleteJob() {
//     this.isDeleting = true;
//     // console.log(this.slug);
    
//     this.JobService.delete_job(this.slug)
//     .subscribe(
//         (data: any) => {
//             // console.log(data);
//             this.router.navigateByUrl('/shop');
//             console.log("Comment deleted successfully");
//             // console.log(this.comments);                
//         });
// }

// empty_comment() {
//     this.commentControl.reset('');
//     this.isSubmitting = false;
// }
///////////////////////////////////////////////


}
